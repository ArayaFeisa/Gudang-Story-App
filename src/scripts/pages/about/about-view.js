const AboutView = {
  render() {
    return `
      <a href="#about-container" class="skip-to-content">Langsung ke profil kami</a>

      <section class="container" id="about-container" tabindex="-1" style="max-width: 800px; margin: 0 auto; padding: 2rem;">
        <h1 style="text-align: center; margin-bottom: 1.5rem;">Tentang Platform Ini</h1>
        <p style="font-size: 1.1rem; line-height: 1.6;">
          Website ini memungkinkan pengguna untuk membagikan kisah mereka secara visual 
          melalui foto dan deskripsi singkat. Dilengkapi dengan fitur pemetaan lokasi, pengguna dapat melihat di mana cerita 
          itu terjadi secara langsung di peta interaktif.
        </p>
        <p style="font-size: 1.1rem; line-height: 1.6;">
          Platform ini memanfaatkan teknologi seperti Leaflet.js, OpenStreetMap, dan Web API untuk pengalaman interaktif dan real-time.
        </p>
        <hr style="margin: 2rem 0;">
        <h2 style="text-align: center;">Pembuat Website</h2>
        <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem; margin-top: 1rem;">
          <img src="/images/pmpm.jpg" alt="foto gw" style="border-radius: 50%; width: 150px; height: 150px;">
          <h3>Raya</h3>
          <p style="text-align: center; max-width: 600px;">
            Seorang mahasiswa Teknologi Informasi dan peserta Coding Camp 2025.
          </p>
        </div>
      </section>
    `;
  },
};

export default AboutView;
