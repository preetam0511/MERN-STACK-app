import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import RateLimitedUI from '../components/RateLimitedUI';
import axios from 'axios';
import NotesNotFound from '../components/NotesNotFound';
import NoteCard from '../components/Notecard';
import { toast } from 'react-hot-toast';

// Configure axios defaults
axios.defaults.withCredentials = true;

const Homepage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false); 
  const [notes,setNotes]= useState([]);
  const [loading,setLoading]= useState(false);

  useEffect(() => {
    const fetchNotes = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/notes");
            const data = await response.data;
            setNotes(data); // Axios response data is in response.data
            setIsRateLimited(false);
            console.log(data);
        } catch (err) {
            console.log(err);
            if (err.response && err.response.status === 429) {
                // Rate limited
                setIsRateLimited(true);
            }
            else{
                toast.error("Something went wrong");
            }
        }
        finally{
            setLoading(false);
        }
    }
    fetchNotes();
}, []);
    return (
        <div className="min-h-screen">
            <Navbar />
            {isRateLimited && <RateLimitedUI />}
            <div className="max-w-7xl mx-auto p-4 mt-6">
        {loading && <div className="text-center text-primary py-10">Loading notes...</div>}

        {notes.length === 0 && !isRateLimited && <NotesNotFound />}

        {notes.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard key={note._id} note={note} setNotes={setNotes} />
            ))}
          </div>
        )}
      </div>
        </div>
    );
};

export default Homepage;