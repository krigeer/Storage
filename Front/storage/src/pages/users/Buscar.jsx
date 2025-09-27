import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Titulo from "../../components/UI/Titulo";
import Tabla from "../../components/UI/Tabla";
import { apiCall } from "../../services/apiCutoms";

const headersConfig = {
  tecnologias: {
    nombre: "Nombre",
    tipo: "Tipo",
    serie_fabricante: "Serial fabricante",
    serie_sena: "Serial SENA",
    estado: "Estado",
    marca: "Marca",
  },
  materiales_didacticos: {
    nombre: "Nombre",
    serie_fabricante: "Serial fabricante",
    serie_sena: "Serial SENA",
    estado: "Estado",
  },
  usuarios: {
    titulo: "Nombre",
    documento: "Documento",
    email: "Email",
    estado: "Estado",
  },
  reportes: {
    titulo: "Titulo",
    usuario: "Usuario",
    prioridad: "Prioridad",
    estado: "Estado",
  },
};

const camposConfig = {
  tecnologias: {
    nombre: "nombre",
    tipo: (item) => item.tipo || "",
    serie_fabricante: "serie_fabricante",
    serie_sena: "serie_sena",
    estado: "estado",
    marca: (item) => item.marca || "",
  },
  materiales_didacticos: {
    nombre: "nombre",
    serie_fabricante: "serie_fabricante",
    serie_sena: "serie_sena",
    estado: "estado",
  },
  usuarios: {
    titulo: (item) => `${item.first_name || ""} ${item.last_name || ""}`.trim(),
    documento: "documento",
    email: "email",
    estado: "estado",
  },
  reportes: {
    titulo: "titulo",
    usuario: (item) => `${item.usuario || ""}`,
    prioridad: "prioridad",
    estado: "estado",
  },
};

const matchItem = (item, fields, q) => {
  const needle = q.toLowerCase();
  for (const f of fields) {
    const v = typeof f === "function" ? f(item) : item[f];
    if (v && String(v).toLowerCase().includes(needle)) return true;
  }
  return false;
};

export default function Buscar() {
  const [params] = useSearchParams();
  const query = params.get("q") || "";

  const [data, setData] = useState({
    tecnologias: [],
    materiales_didacticos: [],
    usuarios: [],
    reportes: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [tec, mat, usr, rep] = await Promise.all([
        apiCall("tecnologias"),
        apiCall("materiales_didacticos"),
        apiCall("usuarios"),
        apiCall("reportes"),
      ]);

      setData({
        tecnologias: Array.isArray(tec?.results) ? tec.results : [],
        materiales_didacticos: Array.isArray(mat?.results) ? mat.results : [],
        usuarios: Array.isArray(usr?.results) ? usr.results : [],
        reportes: Array.isArray(rep?.results) ? rep.results : [],
      });
    } catch (e) {
      setError(e?.message || "Error al cargar datos");
      setData({ tecnologias: [], materiales_didacticos: [], usuarios: [], reportes: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return data;

    return {
      tecnologias: data.tecnologias.filter((it) =>
        matchItem(
          it,
          [
            (x) => x.nombre,
            (x) => x.descripcion,
            (x) => x.serie_fabricante,
            (x) => x.serie_sena,
            (x) => x.estado,
            (x) => x.marca,
            (x) => x.tipo,
          ],
          q
        )
      ),
      materiales_didacticos: data.materiales_didacticos.filter((it) =>
        matchItem(
          it,
          [
            (x) => x.nombre,
            (x) => x.descripcion,
            (x) => x.serie_fabricante,
            (x) => x.serie_sena,
            (x) => x.estado,
          ],
          q
        )
      ),
      usuarios: data.usuarios.filter((it) =>
        matchItem(
          it,
          [
            (x) => x.first_name,
            (x) => x.last_name,
            (x) => x.username,
            (x) => x.email,
            (x) => x.documento,
            (x) => x.estado,
          ],
          q
        )
      ),
      reportes: data.reportes.filter((it) =>
        matchItem(
          it,
          [
            (x) => x.titulo,
            (x) => x.usuario,
            (x) => x.prioridad,
            (x) => x.estado,
            (x) => x.observacion,
          ],
          q
        )
      ),
    };
  }, [data, query]);

  if (loading) return <div className="text-center mt-5">Cargando resultados...</div>;
  if (error) return <div className="text-center text-danger mt-5">{error}</div>;

  const totalResultados =
    filtered.tecnologias.length +
    filtered.materiales_didacticos.length +
    filtered.usuarios.length +
    filtered.reportes.length;

  return (
    <div className="container py-4">
      <Titulo
        titulo={`Resultados de búsqueda`}
        descripcion={
          query ? `Término: "${decodeURIComponent(query)}" • ${totalResultados} resultados` : ""
        }
      />

      {query && totalResultados === 0 && (
        <div className="alert alert-info">No se encontraron resultados para "{decodeURIComponent(query)}"</div>
      )}

      {filtered.tecnologias.length > 0 && (
        <div className="mb-5">
          <h5 className="fw-bold mb-3">Tecnologías ({filtered.tecnologias.length})</h5>
          <Tabla
            title="Tecnologías"
            headers={headersConfig.tecnologias}
            campos={camposConfig.tecnologias}
            data={filtered.tecnologias}
            apiEndpoint="tecnologias"
            onDataChange={fetchAll}
          />
        </div>
      )}

      {filtered.materiales_didacticos.length > 0 && (
        <div className="mb-5">
          <h5 className="fw-bold mb-3">Materiales Didácticos ({filtered.materiales_didacticos.length})</h5>
          <Tabla
            title="Materiales Didácticos"
            headers={headersConfig.materiales_didacticos}
            campos={camposConfig.materiales_didacticos}
            data={filtered.materiales_didacticos}
            apiEndpoint="materiales_didacticos"
            onDataChange={fetchAll}
          />
        </div>
      )}

      {filtered.usuarios.length > 0 && (
        <div className="mb-5">
          <h5 className="fw-bold mb-3">Usuarios ({filtered.usuarios.length})</h5>
          <Tabla
            title="Usuarios"
            headers={headersConfig.usuarios}
            campos={camposConfig.usuarios}
            data={filtered.usuarios}
            apiEndpoint="usuarios"
            onDataChange={fetchAll}
          />
        </div>
      )}

      {filtered.reportes.length > 0 && (
        <div className="mb-5">
          <h5 className="fw-bold mb-3">Reportes ({filtered.reportes.length})</h5>
          <Tabla
            title="Reportes"
            headers={headersConfig.reportes}
            campos={camposConfig.reportes}
            data={filtered.reportes}
            apiEndpoint="reportes"
            onDataChange={fetchAll}
          />
        </div>
      )}
    </div>
  );
}
