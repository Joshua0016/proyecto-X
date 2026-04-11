import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

export default function FamilyDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const { family } = location.state || {};

  if (!family) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <p className="text-gray-500">No se encontraron datos de la familia.</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          onClick={() => navigate(-1)}
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex justify-center p-6">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6">

        {/* BOTÓN VOLVER */}
        <button
          className="mb-4 text-sm text-blue-500 hover:underline"
          onClick={() => navigate(-1)}
        >
          ← Volver
        </button>

        {/* HEADER FAMILIA */}
        <div className="mb-6 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Familia {family.lastName || "Sin nombre"}
          </h1>

          <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span> {family.sector || "Sin sector"}</span>
            <span> {family.address || "Sin dirección"}</span>
            <span>
              {" "}
              {family.createdAt || family.CreatedAt
                ? dayjs(family.createdAt ?? family.CreatedAt).format("YYYY-MM-DD")
                : "Sin fecha"}
            </span>
            <span> {family.familyId}</span>
          </div>
        </div>

        {/* MIEMBROS */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Miembros de la familia
          </h2>

          {!family.members?.length && (
            <p className="text-gray-500">No hay miembros en esta familia.</p>
          )}

          <div className="space-y-3">
            {family.members?.map((member, index) => {
              const id = member.memberId ?? index;

              return (
                <div
                  key={id}
                  className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 flex justify-between items-center shadow-sm hover:shadow-md transition"
                >
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {(member.firstName ?? member.FirstName) || "Sin nombre"}{" "}
                      {(member.lastName ?? member.LastName) || ""}
                    </p>

                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {(member.phoneNumber ?? member.PhoneNumber) || "Sin teléfono"}
                    </p>

                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {(member.email ?? member.Email) || "Sin email"}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      {" "}
                      {member.birthDate || member.BirthDate
                        ? dayjs(member.birthDate ?? member.BirthDate).format("YYYY-MM-DD")
                        : "Sin cumpleaños"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}