import { useRef, useState, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage, handleTyping } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      
      // Indiquer que l'utilisateur a arrêté d'écrire après l'envoi du message
      handleTyping(false);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };
  
  // Gérer l'événement de typing
  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    
    console.log("handleTextChange appelé avec texte:", newText);
    
    // Si l'utilisateur commence à écrire, émettre l'événement typing
    if (newText.length > 0) {
      console.log("Déclenchement de l'événement typing (true)");
      
      // Appeler handleTyping avec un petit délai pour éviter les appels trop fréquents
      // Réinitialiser le timeout précédent
      if (typingTimeout) {
        console.log("Réinitialisation du timeout précédent");
        clearTimeout(typingTimeout);
      }
      
      // Émettre l'événement typing immédiatement
      handleTyping(true);
      
      // Définir un nouveau timeout pour arrêter l'événement typing après 2 secondes d'inactivité
      console.log("Configuration d'un nouveau timeout de 2 secondes");
      const newTimeout = setTimeout(() => {
        console.log("Timeout expiré, arrêt de l'événement typing");
        handleTyping(false);
      }, 2000);
      
      setTypingTimeout(newTimeout);
    } else {
      // Si le texte est vide, arrêter l'événement typing immédiatement
      console.log("Texte vide, arrêt immédiat de l'événement typing");
      handleTyping(false);
      if (typingTimeout) clearTimeout(typingTimeout);
    }
  };
  
  // Nettoyer le timeout quand le composant est démonté
  useEffect(() => {
    console.log("MessageInput monté");
    return () => {
      console.log("MessageInput démonté, nettoyage des ressources");
      if (typingTimeout) clearTimeout(typingTimeout);
      handleTyping(false);
    };
  }, [typingTimeout, handleTyping]);

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={handleTextChange}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;