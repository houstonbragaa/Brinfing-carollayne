// Progress bar
const form = document.getElementById("briefingForm");
const fill = document.getElementById("progressFill");

function updateProgress() {
  const fields = form.querySelectorAll(
    'input:not([type="checkbox"]):not([type="radio"]), textarea, select'
  );

  let filled = 0;

  fields.forEach((f) => {
    if (f.value.trim()) filled++;
  });

  const pct = Math.min(100, Math.round((filled / fields.length) * 100));
  fill.style.width = pct + "%";
}

form.addEventListener("input", updateProgress);
form.addEventListener("change", updateProgress);

// Webhook Make
const MAKE_WEBHOOK_URL =
  "https://hook.us2.make.com/fft4wojuk1ii56l8pk3kcp91emgq5nx7";

// Submit correto
async function handleSubmit(e) {
  e.preventDefault();

  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;

  submitBtn.disabled = true;
  submitBtn.textContent = "Enviando...";

  // Pega dados do form — funciona certinho para os 20 campos,
  // incluindo os 7 campos de checkbox múltiplo agrupados com vírgula
  const formData = new FormData(form);

  const data = {};

  formData.forEach((value, key) => {
    if (data.hasOwnProperty(key)) {
      data[key] = Array.isArray(data[key]) ? data[key] : [data[key]];
      data[key].push(value);
    } else {
      data[key] = value;
    }
  });

  Object.keys(data).forEach((key) => {
    if (Array.isArray(data[key])) {
      data[key] = data[key].join(", ");
    }
  });

  try {
    await fetch(MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
      body: JSON.stringify(data),
    });

    document.getElementById("briefingForm").style.display = "none";
    document.getElementById("thankyou").style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });

  } catch (err) {
    console.error("Erro ao enviar:", err);

    alert(
      "Não foi possível enviar o formulário. Verifique sua conexão e tente novamente."
    );

    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

form.addEventListener("submit", handleSubmit);