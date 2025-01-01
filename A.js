document.getElementById("confirmButton").addEventListener("click", () => {
    const chargeCount = parseInt(document.getElementById("chargeCount").value, 10);
    if (chargeCount > 0 && chargeCount <= 10) {
      initializeCharges(chargeCount);
      document.getElementById("info").classList.add("hidden");
      document.getElementById("simulation").classList.remove("hidden");
    } else {
      alert("1에서 10 사이의 숫자를 입력하세요.");
    }
  });
  
  let charges = [];
  let currentChargeIndex = -1;
  
  function initializeCharges(count) {
    const chargeArea = document.getElementById("chargeArea");
    chargeArea.innerHTML = "";
    drawHorizontalMarkers();
  
    for (let i = 0; i < count; i++) {
      const charge = document.createElement("div");
      charge.className = "charge";
      charge.style.left = `${(chargeArea.offsetWidth / (count + 1)) * (i + 1) - 20}px`; // 위치 조정
      charge.style.top = "50%";
      charge.style.backgroundColor = getRandomPastelColor();
      charge.textContent = `Q${i + 1}`;
      charge.draggable = true;
  
      charge.addEventListener("click", () => openChargeModal(i));
      charge.addEventListener("dragend", (event) => {
        const rect = chargeArea.getBoundingClientRect();
        const x = Math.round((event.clientX - rect.left) / 50) * 50; // Snap to marker
        if (x >= 0 && x <= rect.width) {
          charge.style.left = `${x}px`;
        }
      });
  
      chargeArea.appendChild(charge);
      charges.push({
        element: charge,
        chargeAmount: 0,
        isPositive: true,
        position: i,
      });
    }
  }
  
  function drawHorizontalMarkers() {
    const chargeArea = document.getElementById("chargeArea");
    const markers = [-3, -2, -1, 0, 1, 2, 3];
    markers.forEach((marker) => {
      const markerDiv = document.createElement("div");
      markerDiv.className = "marker";
      markerDiv.style.left = `${(marker + 3) * (chargeArea.offsetWidth / 7)}px`;
      markerDiv.textContent = marker === 0 ? "0" : `${marker}d`;
      chargeArea.appendChild(markerDiv);
    });
  }
  
  function openChargeModal(index) {
    currentChargeIndex = index;
    const modal = document.getElementById("chargeModal");
    modal.classList.remove("hidden");
  }
  
  document.getElementById("saveCharge").addEventListener("click", () => {
    const chargeAmount = parseFloat(document.getElementById("chargeAmount").value);
    const chargeType = document.getElementById("chargeType").value;
  
    charges[currentChargeIndex].chargeAmount = chargeAmount;
    charges[currentChargeIndex].isPositive = chargeType === "positive";
    
    charges[currentChargeIndex].element.textContent = charges[currentChargeIndex].isPositive ? `+${chargeAmount}` : `-${chargeAmount}`;
    document.getElementById("chargeModal").classList.add("hidden");
  });
  
  document.getElementById("completeButton").addEventListener("click", () => {
    calculateForces();
    document.getElementById("forceArea").classList.remove("hidden");
  });
  
  function getRandomPastelColor() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 80%)`;
  }
  
  function calculateForces() {
    const forceArea = document.getElementById("forceArea");
    forceArea.innerHTML = "<p>전하들의 알짜힘과 방향이 나타납니다.</p>";  // 초기화
  
    // 쿨롱 법칙 적용
    for (let i = 0; i < charges.length; i++) {
      let netForceX = 0;
      let netForceY = 0;
  
      for (let j = 0; j < charges.length; j++) {
        if (i !== j) {
          const r = Math.abs(parseFloat(charges[i].element.style.left) - parseFloat(charges[j].element.style.left)) / 50;
          const k = 9 * Math.pow(10, 9); // 쿨롱 상수
          const q1 = charges[i].chargeAmount * (charges[i].isPositive ? 1 : -1);
          const q2 = charges[j].chargeAmount * (charges[j].isPositive ? 1 : -1);
          const force = (k * q1 * q2) / Math.pow(r, 2);
  
          // X와 Y 방향의 힘 계산
          const forceX = force * (parseFloat(charges[j].element.style.left) - parseFloat(charges[i].element.style.left)) / r;
          const forceY = 0;
  
          netForceX += forceX;
          netForceY += forceY;
        }
      }
  
      // 힘의 방향을 화살표로 나타내기
      const arrow = document.createElement("div");
      arrow.className = "arrow";
      const angle = Math.atan2(netForceY, netForceX) * 180 / Math.PI;
      arrow.style.transform = `rotate(${angle}deg)`;
      arrow.style.left = charges[i].element.style.left;
      arrow.style.top = "50%";  // 힘의 방향에 맞춰 위치
  
      forceArea.appendChild(arrow);
    }
  }
  