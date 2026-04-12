import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { UserCircle, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (d) => d ? dayjs(d).format("DD MMM YYYY") : null;

const Field = ({ label, value }) => (
  <div className="space-y-0.5">
    <p className="text-xs text-gray-500 uppercase font-medium tracking-wide">{label}</p>
    <p className="text-sm text-gray-900 dark:text-gray-100">{value ?? "—"}</p>
  </div>
);

const Section = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest border-b border-gray-200 dark:border-gray-700 pb-1 mb-3">
      {title}
    </h3>
    <div className="grid grid-cols-2 gap-x-6 gap-y-3">{children}</div>
  </div>
);

const Badge = ({ children, color = "gray" }) => {
  const colors = {
    gray:  "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
    blue:  "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    green: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    red:   "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  };
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium ${colors[color]}`}>
      {children}
    </span>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function MemberDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const member = location.state?.member;

  if (!member) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">No se encontraron datos del miembro.</p>
        <Button onClick={() => navigate(-1)}>Volver</Button>
      </div>
    );
  }

  // Normaliza camelCase y PascalCase
  const g = (camel, pascal) => member[camel] ?? member[pascal];

  const firstName     = g("firstName",             "FirstName");
  const secondName    = g("secondName",            "SecondName");
  const lastName      = g("lastName",              "LastName");
  const secondLast    = g("secondLastName",        "SecondLastName");
  const gender        = g("gender",                "Gender");
  const birthDate     = g("birthDate",             "BirthDate");
  const birthPlace    = g("birthPlace",            "BirthPlace");
  const nationality   = g("nationality",           "Nationality");
  const marital       = g("maritalStatus",         "MaritalStatus");
  const nationalId    = g("nationalId",            "NationalId");
  const passport      = g("passportNumber",        "PassportNumber");
  const bloodType     = g("bloodType",             "BloodType");
  const medicalCond   = g("medicalCondition",      "MedicalCondition");
  const phone         = g("phoneNumber",           "PhoneNumber");
  const email         = g("email",                 "Email");
  const address       = g("address",               "Address");
  const emergency     = g("emergencyContactName",  "EmergencyContactName");
  const emergencyPh   = g("emergencyContactPhone", "EmergencyContactPhone");
  const memberType    = g("memberType",            "MemberType");
  const isActive      = g("isActive",              "IsActive");
  const joinDate      = g("joinDate",              "JoinDate");
  const convDate      = g("conversionDate",        "ConversionDate");
  const originChurch  = g("originChurch",          "OriginChurch");
  const baptized      = g("baptized",              "Baptized");
  const baptismDate   = g("baptismDate",           "BaptismDate");
  const baptismPlace  = g("baptismPlace",          "BaptismPlace");
  const discipleship  = g("discipleshipLevel",     "DiscipleshipLevel");
  const discipline    = g("discipline",            "Discipline");
  const courtCase     = g("courtCase",             "CourtCase");
  const transferDate  = g("transferDate",          "TransferDate");
  const transferDest  = g("transferDestination",   "TransferDestination");
  const academicLevel = g("academicLevel",         "AcademicLevel");
  const profession    = g("profession",            "Profession");
  const occupation    = g("occupation",            "Occupation");
  const memberCourses = g("memberCourses",         "MemberCourses");
  const memberSkills  = g("memberSkills",          "MemberSkills");
  const relationship  = g("relationship",          "Relationship");
  const createdAt     = g("createdAt",             "CreatedAt");
  const updatedAt     = g("updatedAt",             "UpdatedAt");

  const fullName = [firstName, secondName, lastName, secondLast].filter(Boolean).join(" ");
  const genderLabel = gender === "M" ? "Masculino" : gender === "F" ? "Femenino" : gender;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex justify-center p-6">
      <div className="w-full max-w-2xl space-y-4">

        <button
          className="text-sm text-white bg-gray-900 hover:bg-gray-700 py-1 px-4 rounded-lg transition"
          onClick={() => navigate(-1)}
        >
          ← Volver
        </button>

        {/* CARD PRINCIPAL */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">

          {/* HEADER */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-700 p-6">
            <div className="flex items-center gap-4">
              <UserCircle className="h-16 w-16 text-gray-400 shrink-0" />
              <div>
                <h1 className="text-2xl font-bold text-white leading-tight">{fullName || "Sin nombre"}</h1>
                <div className="flex flex-wrap gap-2 mt-2">
                  {relationship && <Badge color="blue">{relationship}</Badge>}
                  {memberType && <Badge color="gray">{memberType}</Badge>}
                  {isActive !== undefined && isActive !== null && (
                    <Badge color={isActive ? "green" : "red"}>
                      {isActive
                        ? <><CheckCircle2 className="h-3 w-3" /> Activo</>
                        : <><XCircle className="h-3 w-3" /> Inactivo</>
                      }
                    </Badge>
                  )}
                  {discipline && <Badge color="amber">Disciplina</Badge>}
                  {courtCase && <Badge color="red">Caso judicial</Badge>}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">

            {/* DATOS PERSONALES */}
            <Section title="Datos Personales">
              <Field label="Género"              value={genderLabel} />
              <Field label="Estado Civil"        value={marital} />
              <Field label="Fecha de Nacimiento" value={fmt(birthDate)} />
              <Field label="Lugar de Nacimiento" value={birthPlace} />
              <Field label="Nacionalidad"        value={nationality} />
              <Field label="Cédula / ID"         value={nationalId} />
              <Field label="Pasaporte"           value={passport} />
              <Field label="Tipo de Sangre"      value={bloodType} />
              {medicalCond && <Field label="Condición Médica" value={medicalCond} />}
            </Section>

            {/* CONTACTO */}
            <Section title="Contacto">
              <Field label="Teléfono"                  value={phone} />
              <Field label="Email"                     value={email} />
              <Field label="Dirección"                 value={address} />
              <Field label="Contacto de Emergencia"    value={emergency} />
              <Field label="Teléfono de Emergencia"    value={emergencyPh} />
            </Section>

            {/* MEMBRESÍA */}
            <Section title="Membresía">
              <Field label="Fecha de Ingreso"    value={fmt(joinDate)} />
              <Field label="Fecha de Conversión" value={fmt(convDate)} />
              <Field label="Iglesia de Origen"   value={originChurch} />
              <Field label="Bautizado"           value={baptized ? "Sí" : "No"} />
              <Field label="Fecha de Bautismo"   value={fmt(baptismDate)} />
              <Field label="Lugar de Bautismo"   value={baptismPlace} />
              <Field label="Nivel de Discipulado" value={discipleship} />
            </Section>

            {/* TRASLADO */}
            {(transferDate || transferDest) && (
              <Section title="Traslado">
                <Field label="Fecha de Traslado"  value={fmt(transferDate)} />
                <Field label="Iglesia Destino"    value={transferDest} />
              </Section>
            )}

            {/* EDUCACIÓN Y TRABAJO */}
            <Section title="Educación y Trabajo">
              <Field label="Nivel Académico" value={academicLevel} />
              <Field label="Profesión"       value={profession} />
              <Field label="Ocupación"       value={occupation} />
              {memberCourses && <Field label="Cursos" value={memberCourses} />}
              {memberSkills  && <Field label="Habilidades" value={memberSkills} />}
            </Section>

            {/* REGISTRO */}
            <Section title="Registro">
              <Field label="Creado el"       value={fmt(createdAt)} />
              <Field label="Actualizado el"  value={fmt(updatedAt)} />
            </Section>

          </div>
        </div>
      </div>
    </div>
  );
}
