// Wit Science Consulting — small site script. No cookies, no tracking.

// Mobile menu
(function () {
  var btn = document.querySelector(".menu-toggle");
  var nav = document.querySelector(".nav");
  if (!btn || !nav) return;
  btn.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") nav.classList.remove("open");
  });
})();

// Contact form → Web3Forms → wit-scienceconsulting@outlook.com
// The access key is public by design (Web3Forms puts it in client-side HTML);
// it only allows sending to the inbox it was created for.
var WEB3FORMS_ACCESS_KEY = "8f35dcb2-6664-4f77-8c92-a34f6c67182f";

(function () {
  var form = document.getElementById("contact-form");
  if (!form) return;
  var status = form.querySelector(".form-status");
  var lang = document.documentElement.lang === "de" ? "de" : "en";
  var t = {
    en: {
      sending: "Sending…",
      ok: "Thank you! Your message has been sent. I'll get back to you within two working days.",
      err: "Sorry, your message could not be sent. Please email me directly at wit-scienceconsulting@outlook.com.",
    },
    de: {
      sending: "Wird gesendet…",
      ok: "Vielen Dank! Ihre Nachricht wurde gesendet. Ich melde mich innerhalb von zwei Werktagen.",
      err: "Leider konnte Ihre Nachricht nicht gesendet werden. Bitte schreiben Sie mir direkt an wit-scienceconsulting@outlook.com.",
    },
  }[lang];

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var data = new FormData(form);
    if (data.get("botcheck")) return; // spam trap filled in by a bot
    status.className = "form-status";
    status.textContent = t.sending;
    var button = form.querySelector("button");
    button.disabled = true;

    var payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: "Website enquiry from " + (data.get("name") || "a visitor"),
      from_name: "Wit Science Consulting website",
      name: data.get("name"),
      email: data.get("email"),
      organisation: data.get("organisation") || "",
      message: data.get("message"),
      language: lang,
    };

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res && res.success) {
          status.className = "form-status ok";
          status.textContent = t.ok;
          form.reset();
        } else {
          throw new Error(res && res.message);
        }
      })
      .catch(function () {
        status.className = "form-status err";
        status.textContent = t.err;
      })
      .finally(function () { button.disabled = false; });
  });
})();
