(() => {
  async function loadCellPhoto(img){
    const src = img?.dataset?.b64Src;
    if(!src) return;
    try{
      const res = await fetch(src, { cache: "force-cache" });
      if(!res.ok) throw new Error("HTTP " + res.status);

      const b64 = (await res.text()).trim();
      if(!b64.startsWith("UklGR")) throw new Error("Payload WebP tidak valid");

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error("Browser gagal merender gambar"));
        img.src = "data:image/webp;base64," + b64;
      });

      img.classList.add("is-loaded");
      img.classList.remove("is-error");
    }catch(err){
      img.classList.add("is-error");
      img.alt = "Gambar sel gagal dimuat";
      console.error("Cell image load failed:", src, err);
    }
  }

  document.querySelectorAll(".cell-photo-image[data-b64-src]").forEach(loadCellPhoto);
})();