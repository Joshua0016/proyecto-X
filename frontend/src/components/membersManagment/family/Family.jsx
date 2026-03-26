import { useState } from 'react';

export default function Family() {
    const [formData, setFormData] = useState({
        familyName: '',
        address: '',
        phoneNumber: ''
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // AJUSTA ESTA URL: Debe coincidir con tu endpoint de .NET (ej: https://localhost:7001/api/Families)
            const response = await fetch('https://tu-api-url.com/api/families', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData), // Convertimos el objeto JS a JSON
            });

            if (response.ok) {
                const data = await response.json();
                alert("¡Familia guardada con éxito!");
                // Limpiamos el formulario
                setFormData({ familyName: '', address: '', phoneNumber: '' });
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message || 'No se pudo guardar'}`);
            }
        } catch (error) {
            console.error("Error en la petición:", error);
            alert("Error de conexión con el servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-lg mx-auto bg-white shadow-lg rounded-xl mt-10">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Registro de Familia</h1>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col">
                    <label className="text-gray-600 font-semibold">Nombre de la Familia</label>
                    <input 
                        type="text" 
                        name="familyName"
                        value={formData.familyName}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 rounded text-black focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                        disabled={loading}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-gray-600 font-semibold">Dirección</label>
                    <input 
                        type="text" 
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 rounded text-black focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                        disabled={loading}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-gray-600 font-semibold">Teléfono</label>
                    <input 
                        type="tel" 
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 rounded text-black focus:ring-2 focus:ring-blue-500 outline-none"
                        disabled={loading}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className={`font-bold py-2 rounded mt-4 transition-colors text-white ${
                        loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                    {loading ? 'Guardando...' : 'Guardar Familia'}
                </button>
            </form>
        </div>
    );
}