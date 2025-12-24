document.getElementById("calculateBtn").addEventListener("click", calculateEMI);

function calculateEMI() {
  // const amount = parseFloat(document.getElementById("amount").value);
  // const rate = parseFloat(document.getElementById("rate").value);
  // const tenure = parseInt(document.getElementById("tenure").value);
  // const processingFee = parseFloat(document.getElementById("processingFee").value) || 0;

  const amount = 88532;
  const rate = 16;
  const tenure = 6;
  const processingFee = 299;

  if (!amount || !rate || !tenure) {
    alert("Please enter all required fields");
    return;
  }

  const monthlyRate = rate / 12 / 100;
  const emi = amount * monthlyRate * Math.pow(1 + monthlyRate, tenure) /
    (Math.pow(1 + monthlyRate, tenure) - 1);

  let balance = amount;
  let totalPrincipal = 0;
  let totalInterest = 0;
  let totalGST = 0;
  let processingFeeGST = processingFee * 0.18;


  const tbody = document.querySelector("#emiTable tbody");
  tbody.innerHTML = "";

  for (let i = 1; i <= tenure; i++) {
    const interest = balance * monthlyRate;
    const gst = interest * 0.18;
    const principal = emi - interest;

    balance -= principal;

    totalPrincipal += principal;
    totalInterest += interest;
    totalGST += gst;

    tbody.innerHTML += `
      <tr>
        <td>${i}</td>
        <td>${emi.toFixed(2)}</td>
        <td>${principal.toFixed(2)}</td>
        <td>${interest.toFixed(2)}</td>
        <td>${gst.toFixed(2)}</td>
        <td>${Math.max(balance, 0).toFixed(2)}</td>
      </tr>
    `;
  }



  const totalGSTAll = totalGST + processingFeeGST;

  const grandTotal =
    totalPrincipal +
    totalInterest +
    totalGSTAll +
    processingFee;


  const extraPaid = grandTotal - amount;

  animateValue("sumPrincipal", 0, totalPrincipal);
  animateValue("sumInterest", 0, totalInterest);
  animateValue("sumPF", 0, processingFee);
  animateValue("sumPFGST", 0, processingFeeGST);
  animateValue("sumInterestGST", 0, totalGST);
  animateValue("sumGST", 0, totalGSTAll);
  animateValue("extraPaid", 0, extraPaid);
  animateValue("grandTotal", 0, grandTotal);


  document.getElementById("emiTable").style.display = "table";
  document.getElementById("invoice").style.display = "block";
  document.getElementById("layout").classList.add("show-summary");

}

function animateValue(id, start, end, duration = 600) {
  const el = document.getElementById(id);
  const range = end - start;
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    el.innerText = (start + range * progress).toFixed(2);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
