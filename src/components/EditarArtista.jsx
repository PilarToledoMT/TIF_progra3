import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AgregarArtista.css';

const EditarArtista = () => {
    const { id } = useParams();
    const [artista, setArtista] = useState(null);
    const [nombre, setNombre] = useState('');
    const [bio, setBio] = useState('');
    const [website, setWebsite] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchArtista = async () => {
            try {
                const response = await fetch(`https://sandbox.academiadevelopers.com/harmonyhub/artists/${id}`);
                const data = await response.json();
                setArtista(data);
                setNombre(data.name);
                setBio(data.bio);
                setWebsite(data.website);
            } catch (error) {
                console.error('Error fetching artist:', error);
                setError('Error al cargar el artista.');
            }
        };

        fetchArtista();
    }, [id]);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('authToken');
        const formData = new FormData();
        formData.append('name', nombre);
        formData.append('bio', bio);
        formData.append('website', website);
        if (image) {
            formData.append('image', image);
        }

        try {
            const response = await fetch(`https://sandbox.academiadevelopers.com/harmonyhub/artists/${id}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Token ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            navigate('/artistas');
        } catch (error) {
            console.error('Error updating artist:', error);
            setError('Error al actualizar el artista.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <h1>Editar Artista</h1>
                <form onSubmit={handleSubmit}>
                    <label>
                        Nombre del Artista:
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                            placeholder='Inserte un nombre'
                        />
                    </label>
                    <br />
                    <label>
                        Biografía:
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder='Inserte una pequeña biografía del artista'
                        ></textarea>
                    </label>
                    <br />
                    <label>
                        Página web:
                        <input
                            type="url"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            placeholder='Inserte la web del artista'
                        />
                    </label>
                    <label>
                        Imagen:
                        <input
                            type="file"
                            accept='image/*'
                            onChange={handleImageChange}
                        />
                    </label>
                    <br />
                    <button type="submit" disabled={loading} className="edit-artist-button">
                        {loading ? 'Actualizando...' : 'Actualizar'}
                    </button>
                    {error && <p className='edit-artist-error'>{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default EditarArtista;
