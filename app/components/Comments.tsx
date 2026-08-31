"use client";

import { useState, useEffect } from "react";
import { supabase } from "../utils/client";
import { getTimeAgo } from "../utils/time";
import { type Comment } from "../types/comment";

export default function Comments({ postId }: { postId: string | number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [username, setUsername] = useState("");
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error al obtener los comentarios:", error);
      } else {
        setComments(data);
      }
    };

    fetchComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSending(true);

    const { data, error } = await supabase
      .from("comments")
      .insert({
        post_id: postId,
        username: username.trim() || "anonimo",
        content: content.trim(),
      })
      .select("*")
      .single();

    setIsSending(false);

    if (error) {
      console.error("Error al crear el comentario:", error);
      return;
    }

    setComments((prev) => [...prev, data]);
    setContent("");
  };

  return (
    <div className="border-t border-border pt-3">
      {comments.length > 0 && (
        <ul className="flex flex-col gap-1.5 mb-3">
          {comments.map((comment) => (
            <li key={comment.id} className="text-sm text-foreground">
              <span className="font-semibold">{comment.username}</span>{" "}
              <span className="text-foreground/80">{comment.content}</span>{" "}
              <span className="text-xs text-foreground/40">
                {getTimeAgo(new Date(comment.created_at))}
              </span>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Tu nombre"
          className="w-full px-3 py-1.5 text-sm rounded-lg bg-background border border-border text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <div className="flex gap-2">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Añade un comentario..."
            className="flex-1 px-3 py-1.5 text-sm rounded-lg bg-background border border-border text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button
            type="submit"
            disabled={isSending || !content.trim()}
            className="px-3 py-1.5 text-sm font-semibold text-primary disabled:text-foreground/30 disabled:cursor-not-allowed"
          >
            Publicar
          </button>
        </div>
      </form>
    </div>
  );
}
