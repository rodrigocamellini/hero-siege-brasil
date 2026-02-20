import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  query,
  where
} from 'firebase/firestore';

const BlogComments = React.memo(function BlogComments({ postId }) {
  const [comments, setComments] = useState([]);
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const col = collection(db, 'posts', postId, 'comments');
        let q;
        try {
          q = query(col, where('approved', '==', true));
        } catch {
          q = col;
        }
        const snap = await getDocs(q);
        const arr = [];
        snap.forEach((s) => {
          const d = s.data();
          if (d.approved === true) arr.push({ id: s.id, ...d });
        });
        arr.sort((a, b) => {
          const at = a.createdAt && a.createdAt.seconds ? a.createdAt.seconds : 0;
          const bt = b.createdAt && b.createdAt.seconds ? b.createdAt.seconds : 0;
          return bt - at;
        });
        if (alive) setComments(arr);
      } catch {
        if (alive) setComments([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, [postId]);

  const submit = async () => {
    if (!author || !text) return;
    try {
      await addDoc(collection(db, 'posts', postId, 'comments'), {
        author,
        text,
        approved: false,
        createdAt: serverTimestamp()
      });
      setAuthor('');
      setText('');
      setSent(true);
    } catch {
      // ignore
    }
  };

  return (
    <div>
      <div className="space-y-3 mb-6">
        {comments.length === 0 && (
          <div className="text-gray-500 text-sm">Sem comentários aprovados ainda.</div>
        )}
        {comments.map((c) => (
          <div key={c.id} className="border border-white/10 p-3 bg-black/30">
            <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">
              {c.author || 'Anônimo'}
            </div>
            <div className="text-sm text-gray-200 mt-1">{c.text}</div>
          </div>
        ))}
      </div>
      <div className="border border-white/10 p-4 bg-black/30">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Seu nome"
            className="bg-black/30 border border-white/10 p-3 text-sm text-white focus:border-red-500 outline-none"
          />
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Seu comentário"
            className="bg-black/30 border border-white/10 p-3 text-sm text-white focus:border-red-500 outline-none"
          />
        </div>
        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={submit}
            className="border border-white/10 text-white font-bold uppercase px-6 py-3 text-xs tracking-widest hover:bg-white/5 transition-colors"
          >
            Enviar
          </button>
          {sent && <span className="text-xs text-gray-400">Enviado para aprovação.</span>}
        </div>
      </div>
    </div>
  );
});

export default BlogComments;

