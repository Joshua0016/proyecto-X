import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Field = ({ label, value }) => (
  <div className="space-y-0.5">
    <p className="text-xs text-gray-500 uppercase font-medium">{label}</p>
    <p className="text-sm text-gray-900 dark:text-gray-100">{value || "—"}</p>
  </div>
);

const Section = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 border-b pb-1 mb-3">
      {title}
    </h3>
    <div className="grid grid-cols-2 gap-4">{children}</div>
  </div>
);

export default function MemberDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const member = location.state?.member;

  if (!member) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <p className="text-gray-500">No se encontraron datos del miembro.</p>
        <Button className="mt-4" onClick={() => navigate(-1)}>Volver</Button>
      </div>
    );
  }

  const get = (camel, pascal) => member[camel] ?? member[pascal];

  const firstName    = get("firstName",    "FirstName");
  const secondName   = get("secondName",   "SecondName");
  const lastName     = get("lastName",     "LastName");
  const secondLast   = get("secondLastName","SecondLastName");
  const gender       = get("gender",       "Gender");
  const birthDate    = get("birthDate",    "BirthDate");
  const birthPlace   = get("birthPlace",   "BirthPlace");
  const nationality  = get("nationality",  "Nationality");
  const marital      = get("maritalStatus","MaritalStatus");
  const phone        = get("phoneNumber",  "PhoneNumber");
  const email        = get("email",        "Email");
  const address      = get("address",      "Address");
  const memberType   = get("memberType",   "MemberType");
  const isActive     = get("isActive",     "IsActive");
  const joinDate     = get("joinDate",     "JoinDate");
  const baptized     = get("baptized",     "Baptized");
  const baptismDate  = get("baptismDate",  "BaptismDate");
  const baptismPlace = get("baptismPlace", "BaptismPlace");
  const profession   = get("profession",   "Profession");
  const occupation   = get("occupation",   "Occupation");
  const academicLevel= get("academicLevel","AcademicLevel");
  const relationship = get("relationship", "Relationship");
  const nationalId   = get("nationalId",   "NationalId");
  const bloodType    = get("bloodType",    "BloodType");
  const medicalCond  = get("medicalCondition","MedicalCondition");
  const emergency    = get("emergencyContactName","EmergencyContactName");
  const emergencyPh  = get("emergencyContactPhone","EmergencyContactPhone");

  const fullName = [firstName, secondName, lastName, secondLast].filter(Boolean).join(" ");

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex justify-center p-6">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6">

        {/* BACK */}
        <button
          className="mb-4 text-sm text-white bg-gray-900 hover:bg-gray-700 py-1 px-4 rounded-lg"
          onClick={() => navigate(-1)}
        >
          ← Volver
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-6 pb-4 border-b">
          <UserCircle className="h-16 w-16 text-gray-400 shrink-0" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{fullName}</h1>
            <div className="flex flex-wrap gap-2 mt-1">
              {relationship && (
                <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-0.5 rounded-full">
                  {relationship}
                </span>
              )}
              {memberType && (
                <span className="text-xs bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                  {memberType}
                </span>
              )}
              {isActive !== undefined && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                  {isActive ? "Activo" : "Inactivo"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* DATOS PERSONALES */}
        <Section title="Datos Personales">
          <Field label="Género" value={gender === "M" ? "Masculino" : gender === "F" ? "Femenino" : gender} />
          <Field label="Estado Civil" value={marital} />
          <Field label="Fecha de Nacimiento" value={birthDate ? dayjs(birthDate).format("DD MMM YYYY") : null} />
          <Field label="Lugar de Nacimiento" value={birthPlace} />
          <Field label="Nacionalidad" value={nationality} />
          <Field label="Cédula / ID" value={nationalId} />
          <Field label="Tipo de Sangre" value={bloodType} />
          <Field label="Condición Médica" value={medicalCond} />
        </Section>

        {/* CONTACTO */}
        <Section title="Contacto">
          <Field label="Teléfono" value={phone} />
          <Field label="Email" value={email} />
          <Field label="Dirección" value={address} />
          <Field label="Contacto de Emergencia" value={emergency} />
          <Field label="Teléfono de Emergencia" value={emergencyPh} />
        </Section>

        {/* MEMBRESÍA */}
        <Section title="Membresía">
          <Field label="Fecha de Ingreso" value={joinDate ? dayjs(joinDate).format("DD MMM YYYY") : null} />
          <Field label="Bautizado" value={baptized ? "Sí" : "No"} />
          <Field label="Fecha de Bautismo" value={baptismDate ? dayjs(baptismDate).format("DD MMM YYYY") : null} />
          <Field label="Lugar de Bautismo" value={baptismPlace} />
        </Section>

        {/* EDUCACIÓN Y TRABAJO */}
        <Section title="Educación y Trabajo">
          <Field label="Nivel Académico" value={academicLevel} />
          <Field label="Profesión" value={profession} />
          <Field label="Ocupación" value={occupation} />
        </Section>

      </div>
    </div>
  );
}
