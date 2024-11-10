
document.addEventListener("DOMContentLoaded", () => {
    let deferredPrompt;

    // Verificação para o evento beforeinstallprompt
    window.addEventListener("beforeinstallprompt", (e) => {
e.preventDefault();
deferredPrompt = e;
document.getElementById("installButton").style.display = "block";
});


    // Clique no botão de instalação
    document.getElementById("installButton").addEventListener("click", () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === "accepted") {
            console.log("App instalado com sucesso");
          } else {
            console.log("Usuário recusou a instalação");
          }
          deferredPrompt = null;
        });
      }
    });

    // Verifica se o Service Worker é suportado e registra
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').then((registration) => {
        console.log('Service Worker registrado com sucesso:', registration);
      }).catch((error) => {
        console.error('Falha ao registrar o Service Worker:', error);
      });
    }

    // Verifica se o manifesto foi carregado corretamente
    if (document.querySelector("link[rel='manifest']")) {
      console.log('Manifesto carregado com sucesso');
    } else {
      console.error('Manifesto não encontrado ou não carregado');
    }
  });