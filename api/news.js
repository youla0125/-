export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { query, display, sort } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'query 파라미터가 필요합니다. 예: /api/news?query=한우' });
  }

  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({
      error: 'NAVER_CLIENT_ID / NAVER_CLIENT_SECRET 환경변수가 설정되지 않았습니다. Vercel 프로젝트 설정에서 등록해주세요.',
    });
  }

  // ---- 간단한 키워드 기반 긍정/부정/중립 분류 ----
  // 완벽한 판단은 아니며, 제목+요약에 아래 키워드가 포함되어 있는지로 대략적으로 분류합니다.
  const NEG_KEYWORDS = [
    '조류인플루엔자', 'AI 확진', 'AI확진', '고병원성', '아프리카돼지열병', 'ASF',
    '럼피스킨', '구제역', '살처분', '폐사', '전염병', '의심 신고',
    '폭염 피해', '한파 피해', '냉해', '동해', '가뭄', '침수', '태풍 피해',
    '피해', '급등', '폭등', '부진', '악화', '위기', '우려', '타격', '감소',
    '부족', '붕괴', '중단', '차질', '적자', '논란', '경고',
  ];
  const POS_KEYWORDS = [
    '하락', '안정세', '증가', '호조', '역대 최고', '수출 증가', '수요 증가',
    '풍년', '활기', '개선', '순항', '호평', '인기', '확대', '완화', '회복',
    '역대급', '흑자', '순조', '기대', '강세',
  ];
  function classifySentiment(title, description) {
    const text = `${title} ${description}`;
    if (NEG_KEYWORDS.some((k) => text.includes(k))) return 'neg';
    if (POS_KEYWORDS.some((k) => text.includes(k))) return 'pos';
    return 'neu';
  }

  try {
    const params = new URLSearchParams({
      query,
      display: display || '10',
      sort: sort || 'date',
    });

    const naverRes = await fetch(
      `https://naverapihub.apigw.ntruss.com/search/v1/news?${params.toString()}`,
      {
        headers: {
          'X-NCP-APIGW-API-KEY-ID': clientId,
          'X-NCP-APIGW-API-KEY': clientSecret,
        },
      }
    );

    if (!naverRes.ok) {
      const text = await naverRes.text();
      return res.status(naverRes.status).json({ error: '네이버 API 오류', detail: text });
    }

    const data = await naverRes.json();

    const cleaned = data.items.map((item) => {
      const title = item.title.replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
      const description = item.description.replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
      return {
        title,
        description,
        link: item.link,
        pubDate: item.pubDate,
        sent: classifySentiment(title, description),
      };
    });

    return res.status(200).json({ items: cleaned });
  } catch (err) {
    return res.status(500).json({ error: '서버 오류', detail: String(err) });
  }
}
