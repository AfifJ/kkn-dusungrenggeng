'use client';
import { useState, useEffect } from 'react';

export default function AdminForm({ section }) {
  const [content, setContent] = useState('');
  const [docId, setDocId] = useState('');
  const [items, setItems] = useState([]);

  // Fetch existing content
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/admin?section=${section}`);
        const data = await res.json();
        
        if (section === 'berita' || section === 'gallery') {
          setItems(data);
        } else {
          setContent(data.content);
          setDocId(data.id);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [section]);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    await fetch('/api/admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        section,
        id: docId,
        data: { content, timestamp: new Date() }
      })
    });
    
    alert('Data saved!');
  };

  // Render different UI for collections vs single docs
  if (section === 'berita' || section === 'gallery') {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Manage {section}</h2>
        <button 
          onClick={() => setItems([...items, { id: 'new', content: '' }])}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        >
          Add New
        </button>
        
        {items.map((item, index) => (
          <div key={index} className="mb-4 p-4 border rounded">
            <textarea
              value={item.content}
              onChange={(e) => {
                const newItems = [...items];
                newItems[index].content = e.target.value;
                setItems(newItems);
              }}
              className="w-full p-2 border rounded"
              rows={4}
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={async () => {
                  await fetch('/api/admin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      section,
                      id: item.id,
                      data: { content: item.content }
                    })
                  });
                  alert('Saved!');
                }}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Save
              </button>
              <button
                onClick={async () => {
                  await fetch(`/api/admin?section=${section}&id=${item.id}`, {
                    method: 'DELETE'
                  });
                  const newItems = items.filter((_, i) => i !== index);
                  setItems(newItems);
                }}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Render for single document sections
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold">
        Edit {section.charAt(0).toUpperCase() + section.slice(1)}
      </h2>
      
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-64 p-4 border rounded"
        placeholder={`Enter ${section} content...`}
      />
      
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Save Changes
      </button>
    </form>
  );
}