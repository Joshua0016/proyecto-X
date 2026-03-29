import { useState } from 'react';

export default function Family() {
  // aqui va una lista de familias, cada familia tiene un id, un nombre y una lista de miembros
  const [families, setFamilies] = useState([
    {   id: 1,  name: 'Familia 1', members: ['Miembro 1', 'Miembro 2'] },
    {   id: 2,  name: 'Familia 2', members: ['Miembro 3', 'Miembro 4'] },
    {   id: 3,  name: 'Familia 3', members: ['Miembro 5', 'Miembro 6'] },
  ]);                                           
}
