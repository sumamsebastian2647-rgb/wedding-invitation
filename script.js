/* =====================================
   ANSU & SUNOJ — WEDDING INVITATION JS
===================================== */

const GUESTBOOK_API =
  "https://script.google.com/macros/s/AKfycbzFfSmQQmPJUUZV5VICG3D_5GbaiKf2T4VMSP_ZZfsB9Uz8eVEgY6jXS3Hth5iOo6Ei/exec";


document.addEventListener("DOMContentLoaded", () => {

  /* -------------------------
     MOBILE MENU
  ------------------------- */

  const menu = document.getElementById("menu");
  const links = document.getElementById("links");

  if (menu && links) {
    menu.addEventListener("click", () => {
      const isOpen = links.classList.toggle("open");
      menu.setAttribute("aria-expanded", String(isOpen));
    });

    links.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        links.classList.remove("open");
        menu.setAttribute("aria-expanded", "false");
      });
    });
  }


  /* -------------------------
     WEDDING COUNTDOWN
  ------------------------- */

  const weddingDate =
    new Date("2026-09-15T11:00:00+05:30").getTime();

  function countdown() {
    const elements = {
      days: document.getElementById("days"),
      hours: document.getElementById("hours"),
      mins: document.getElementById("mins"),
      secs: document.getElementById("secs")
    };

    let remaining = weddingDate - Date.now();

    if (remaining < 0) remaining = 0;

    if (elements.days) {
      elements.days.textContent =
        Math.floor(remaining / 86400000);
    }

    if (elements.hours) {
      elements.hours.textContent =
        Math.floor((remaining % 86400000) / 3600000);
    }

    if (elements.mins) {
      elements.mins.textContent =
        Math.floor((remaining % 3600000) / 60000);
    }

    if (elements.secs) {
      elements.secs.textContent =
        Math.floor((remaining % 60000) / 1000);
    }
  }

  countdown();
  setInterval(countdown, 1000);


  /* -------------------------
     BACK TO TOP
  ------------------------- */

  const topButton = document.getElementById("top");

  if (topButton) {
    window.addEventListener("scroll", () => {
      topButton.style.display =
        window.scrollY > 500 ? "block" : "none";
    });

    topButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }


  /* -------------------------
     GUESTBOOK MODAL
  ------------------------- */

  const openButton =
    document.getElementById("openGuestbookBtn");

  const closeButton =
    document.getElementById("closeGuestbookBtn");

  const modal =
    document.getElementById("guestbookModal");

  const guestName =
    document.getElementById("guestName");


  function openGuestbook() {
    if (!modal) return;

    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    setTimeout(() => {
      if (guestName) guestName.focus();
    }, 80);
  }


  function closeGuestbook() {
    if (!modal) return;

    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }


  if (openButton) {
    openButton.addEventListener("click", openGuestbook);
  }

  if (closeButton) {
    closeButton.addEventListener("click", closeGuestbook);
  }

  if (modal) {
    modal.addEventListener("click", event => {
      if (event.target === modal) {
        closeGuestbook();
      }
    });
  }

  document.addEventListener("keydown", event => {
    if (
      event.key === "Escape" &&
      modal &&
      modal.classList.contains("show")
    ) {
      closeGuestbook();
    }
  });


  /* -------------------------
     PUBLISH GUESTBOOK WISH
  ------------------------- */

  const guestbookForm =
    document.getElementById("guestbookForm");

  if (guestbookForm) {

    guestbookForm.addEventListener(
      "submit",
      async event => {

        event.preventDefault();

        const name =
          document.getElementById("guestName")
            .value.trim();

        const message =
          document.getElementById("guestMessage")
            .value.trim();

        const button =
          document.getElementById("publishButton");

        const status =
          document.getElementById("guestbookStatus");


        if (!name || !message) {
          status.textContent =
            "Please enter your name and message.";
          return;
        }


        button.disabled = true;
        button.textContent = "Publishing...";
        status.textContent = "";


        try {

          /*
            Google Apps Script accepts the POST.
            no-cors is used because the Apps Script web app
            does not need to expose the response to the browser.
          */

          await fetch(GUESTBOOK_API, {
            method: "POST",
            mode: "no-cors",
            headers: {
              "Content-Type":
                "text/plain;charset=utf-8"
            },
            body: JSON.stringify({
              name,
              message
            })
          });


          status.textContent =
            "Thank you! Your blessing has been published ♥";

          guestbookForm.reset();


          /*
            Give Google Sheets a moment to save,
            then refresh the displayed wishes.
          */

          setTimeout(async () => {
            closeGuestbook();
            await loadWishes();
          }, 1200);


        } catch (error) {

          console.error(
            "Guestbook submission error:",
            error
          );

          status.textContent =
            "Something went wrong. Please try again.";

        } finally {

          button.disabled = false;
          button.textContent = "Publish ♥";

        }

      }
    );
  }


  /* -------------------------
     LOAD ALL WISHES
  ------------------------- */

  async function loadWishes() {

    const wishesList =
      document.getElementById("wishesList");

    if (!wishesList) return;


    try {

      const response =
        await fetch(
          GUESTBOOK_API + "?t=" + Date.now(),
          {
            method: "GET",
            cache: "no-store"
          }
        );


      if (!response.ok) {
        throw new Error(
          "Unable to load guestbook."
        );
      }


      const wishes =
        await response.json();


      if (!Array.isArray(wishes) || !wishes.length) {

        wishesList.innerHTML = `
          <p class="loading-wishes">
            Be the first to leave a blessing ♥
          </p>
        `;

        return;
      }


      wishesList.innerHTML = "";


      wishes.forEach(wish => {

        const card =
          document.createElement("article");

        card.className = "wish-card";


        const name =
          document.createElement("div");

        name.className = "wish-name";

        name.textContent =
          wish.name || "A dear guest";


        const message =
          document.createElement("div");

        message.className = "wish-message";

        message.textContent =
          wish.message || "";


        card.appendChild(name);
        card.appendChild(message);

        wishesList.appendChild(card);

      });


    } catch (error) {

      console.error(
        "Guestbook loading error:",
        error
      );

      wishesList.innerHTML = `
        <p class="loading-wishes">
          Our guestbook will appear here soon ♥
        </p>
      `;
    }
  }


  /* Load wishes when the page opens */
  loadWishes();


  /* -------------------------
     MUSIC BUTTON
  ------------------------- */

  const musicButton =
    document.getElementById("music");

  if (musicButton) {
    musicButton.addEventListener("click", () => {
      showToast(
        "Add your wedding MP3 file to enable music."
      );
    });
  }


  function showToast(message) {

    const toast =
      document.getElementById("toast");

    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

});
