const GOOGLE_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

let googleScriptPromise = null;

const loadGoogleScript = () => {
  if (window.google?.accounts?.id) {
    return Promise.resolve(window.google);
  }

  if (googleScriptPromise) {
    return googleScriptPromise;
  }

  googleScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${GOOGLE_SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(window.google));
      existing.addEventListener("error", () =>
        reject(new Error("Google sign-in script failed to load"))
      );
      return;
    }

    const script = document.createElement("script");
    script.src = GOOGLE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = () => reject(new Error("Google sign-in script failed to load"));
    document.head.appendChild(script);
  });

  return googleScriptPromise;
};

export const initGoogleButton = async ({
  clientId,
  container,
  onCredential,
  onError,
}) => {
  if (!clientId || !container) {
    return;
  }

  const google = await loadGoogleScript();

  if (!google?.accounts?.id) {
    throw new Error("Google Identity Services unavailable");
  }

  container.innerHTML = "";

  google.accounts.id.initialize({
    client_id: clientId,
    callback: (response) => {
      if (response?.credential) {
        onCredential(response.credential);
      } else if (onError) {
        onError(new Error("Google sign-in failed"));
      }
    },
  });

  google.accounts.id.renderButton(container, {
    theme: "outline",
    size: "large",
    shape: "pill",
    text: "continue_with",
    width: 320,
  });
};
