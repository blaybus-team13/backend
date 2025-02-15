const Center = require("../models/Center");

const API_KEY = "e7e5c0b5d5704ae0bbe04fc8e3e005b2";

async function getData(pIndex = 1, pSize = 100, type = "json") {
  const url = `https://openapi.gg.go.kr/HtygdWelfaclt?KEY=${API_KEY}&Type=${type}&pIndex=${pIndex}&pSize=${pSize}`;
  const response = await fetch(url);
  const data = await response.json();

  if (
    data.HtygdWelfaclt &&
    Array.isArray(data.HtygdWelfaclt) &&
    data.HtygdWelfaclt.length > 1
  ) {
    return data.HtygdWelfaclt[1].row;
  } else {
    console.error("API 응답 구조가 다름:", data);
    return [];
  }
}

async function saveData() {
  const items = await getData();
  const groupedItems = {};

  // 시설명으로 데이터 그룹화
  for (const item of items) {
    if (!groupedItems[item.FACLT_NM]) {
      groupedItems[item.FACLT_NM] = [];
    }
    groupedItems[item.FACLT_NM].push(item);
  }

  for (const [facilityName, facilityItems] of Object.entries(groupedItems)) {
    const firstItem = facilityItems[0];
    const fullAddress = firstItem.REFINE_ROADNM_ADDR;
    const addressParts = fullAddress.split(" ").slice(0, 3);
    const hasVisitBath = facilityItems.some((item) =>
      item.FACLT_KIND_NM.includes("방문목욕")
    );
    const centerData = {
      name: firstItem.FACLT_NM,
      tel: firstItem.DETAIL_TELNO,
      address: addressParts,
      hasVehicle: hasVisitBath,
      operatingEntity: firstItem.COPRTN_GRP_NM || "개인",
      currentWorkers: firstItem.ENFLPSN_PSTPSN_SUM || "0",
    };

    const existingCenter = await Center.findOne({ name: facilityName });
    if (existingCenter) {
      await Center.updateOne({ name: facilityName }, centerData);
    } else {
      const center = new Center(centerData);
      await center.save();
    }
  }
}
module.exports = saveData;

// name -> FACLT_NM
// tel -> DETAIL_TELNO
// address-> REFINE_ROADNM_ADDR
// operatingEntity -> COPRTN_GRP_NM
// currentWorkers -> ENFLPSN_PSTPSN_SUM
