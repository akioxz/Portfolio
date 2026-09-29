import { useState, useRef, useEffect } from "react";
import type { TurnstileInstance } from "@marsidev/react-turnstile";

export function useContactForm(isOpen: boolean, onClose: () => void) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Clean up timeout on unmount or modal close
  useEffect(() => {
    if (!isOpen) {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      setErrorMessage(null);
      setFieldErrors(null);
      setSuccessMessage(null);
      setIsLoading(false);
      setTurnstileToken(null);
      setName("");
      setEmail("");
      setMessage("");
    }

    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    };
  }, [isOpen]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, siteKey?: string) => {
    event.preventDefault();
    setErrorMessage(null);
    setFieldErrors(null);

    const currentTurnstileToken = turnstileRef.current?.getResponse() || turnstileToken;

    if (siteKey && !currentTurnstileToken) {
      setErrorMessage("Please complete the verification below.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          turnstileToken: currentTurnstileToken,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(
          data.error || "Something went wrong. Try emailing dev.akioxz@gmail.com directly."
        );
        if (data.fieldErrors) {
          setFieldErrors(data.fieldErrors);
        }
        setIsLoading(false);
        setTurnstileToken(null);
        turnstileRef.current?.reset();
        return;
      }

      setSuccessMessage(data.message || "Your message was received.");
      setIsLoading(false);

      closeTimerRef.current = setTimeout(() => {
        onClose();
      }, 2500);
    } catch {
      setErrorMessage("Network error. Try emailing dev.akioxz@gmail.com directly.");
      setIsLoading(false);
      setTurnstileToken(null);
      turnstileRef.current?.reset();
    }
  };

  return {
    name, setName,
    email, setEmail,
    message, setMessage,
    turnstileToken, setTurnstileToken,
    turnstileRef,
    isLoading,
    errorMessage,
    fieldErrors,
    successMessage,
    handleSubmit,
  };
}
