import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { ref, get, push, update, remove } from "firebase/database";
import { db } from "../firebase/config";
import styled from "styled-components";
import {
  FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiAlertTriangle, FiLoader,
} from "react-icons/fi";

const Page = styled.div`max-width: 900px; margin: 0 auto; padding: 2rem;`;
const PageTitle = styled.h1`color:#e8e0ff;font-size:1.5rem;font-weight:800;margin:0 0 1.5rem;`;
const Toolbar = styled.div`display:flex;justify-content:flex-end;margin-bottom:1rem;`;
const BtnPrimary = styled.button`
  background:#8250ff;border:none;color:#fff;font-size:.85rem;font-weight:600;
  padding:.5rem 1rem;border-radius:5px;cursor:pointer;display:flex;align-items:center;
  gap:6px;transition:background .2s;
  &:hover{background:#9d6fff;} &:disabled{opacity:.5;cursor:not-allowed;}
`;
const Table = styled.table`width:100%;border-collapse:collapse;font-size:.85rem;`;
const Th = styled.th`text-align:left;color:#4a4560;font-size:.7rem;text-transform:uppercase;
  letter-spacing:.08em;padding:.6rem .75rem;border-bottom:1px solid rgba(130,80,255,.15);`;
const Td = styled.td`padding:.65rem .75rem;color:#c4b0ff;border-bottom:1px solid rgba(130,80,255,.07);
  vertical-align:middle;`;
const Img = styled.img`width:60px;height:34px;object-fit:cover;border-radius:4px;`;
const BtnIcon = styled.button`
  background:transparent;border:none;cursor:pointer;padding:4px 6px;border-radius:4px;
  color:${p => p.$danger ? "#ff9090" : "#7a7290"};transition:all .2s;
  &:hover{background:${p => p.$danger ? "rgba(255,80,80,.1)" : "rgba(130,80,255,.1)"};
    color:${p => p.$danger ? "#ff5050" : "#c4b0ff"};}
`;
const Overlay = styled.div`
  position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:200;
  display:flex;align-items:center;justify-content:center;padding:1rem;
`;
const Modal = styled.div`
  background:#13121f;border:1px solid rgba(130,80,255,.25);border-radius:10px;
  padding:2rem;width:100%;max-width:480px;
`;
const ModalTitle = styled.h2`color:#e8e0ff;font-size:1.1rem;font-weight:700;margin:0 0 1.25rem;`;
const FormGrid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:.75rem;
  @media(max-width:500px){grid-template-columns:1fr;}`;
const FormField = styled.div`
  display:flex;flex-direction:column;gap:4px;
  &.full{grid-column:1/-1;}
  label{color:#7a7290;font-size:.78rem;font-weight:500;}
  input,select,textarea{background:#0a0917;border:1px solid rgba(130,80,255,.2);
    color:#e8e0ff;font-size:.85rem;padding:.5rem .75rem;border-radius:5px;
    outline:none;transition:border-color .2s;font-family:inherit;
    &::placeholder{color:#4a4560;}&:focus{border-color:#8250ff;}}
  textarea{resize:vertical;min-height:70px;}
`;
const ModalActions = styled.div`display:flex;gap:.75rem;justify-content:flex-end;margin-top:1.25rem;`;
const BtnGhost = styled.button`
  background:transparent;border:1px solid rgba(130,80,255,.25);color:#7a7290;
  font-size:.85rem;padding:.5rem 1rem;border-radius:5px;cursor:pointer;
  transition:all .2s;&:hover{border-color:#8250ff;color:#e8e0ff;}
`;
const ConfirmModal = styled(Modal)`max-width:360px;text-align:center;`;
const ConfirmText = styled.p`color:#9490b0;font-size:.9rem;margin:.5rem 0 1.5rem;`;
const BtnDanger = styled(BtnPrimary)`background:rgba(255,80,80,.15);color:#ff9090;border:1px solid rgba(255,80,80,.3);
  &:hover{background:rgba(255,80,80,.3);}`;
const SpinnerBox = styled.div`text-align:center;padding:3rem;color:#4a4560;font-size:.9rem;`;
const ErrorBox = styled.div`background:rgba(255,80,80,.08);border:1px solid rgba(255,80,80,.2);
  color:#ff9090;padding:1rem;border-radius:8px;margin-bottom:1rem;font-size:.85rem;`;

const EMPTY = { name: "", price: "", stock: "", category: "", description: "", image: "" };
const CATS = ["Action", "RPG", "Strategy", "Indie", "Horror", "Simulation"];

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  async function fetchProducts() {
    setLoading(true);
    setError(null);
    try {
      const snap = await get(ref(db, "products"));
      if (snap.exists()) {
        const arr = Object.entries(snap.val()).map(([id, val]) => ({ id, ...val }));
        setProducts(arr);
      } else {
        setProducts([]);
      }
    } catch {
      setError("No se pudo cargar los productos de Firebase.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchProducts(); }, []);

  function openNew() { setForm(EMPTY); setEditing(null); setFormError(""); setFormOpen(true); }
  function openEdit(p) {
    setForm({ name: p.name, price: p.price, stock: p.stock, category: p.category || "", description: p.description || "", image: p.image || "" });
    setEditing(p); setFormError(""); setFormOpen(true);
  }
  function closeForm() { setFormOpen(false); setEditing(null); setFormError(""); }

  function validate() {
    if (!form.name.trim()) return "El nombre es obligatorio.";
    if (!form.price || Number(form.price) <= 0) return "El precio debe ser mayor a 0.";
    if (form.stock === "" || Number(form.stock) < 0) return "El stock debe ser ≥ 0.";
    return null;
  }

  async function handleSave() {
    const err = validate();
    if (err) { setFormError(err); return; }
    setSaving(true);
    const data = {
      name: form.name.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      category: form.category,
      description: form.description.trim(),
      image: form.image.trim(),
    };
    try {
      if (editing) {
        await update(ref(db, `products/${editing.id}`), data);
      } else {
        await push(ref(db, "products"), data);
      }
      await fetchProducts();
      closeForm();
    } catch {
      setFormError("Error al guardar. Revisá la conexión con Firebase.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirmDelete) return;
    try {
      await remove(ref(db, `products/${confirmDelete.id}`));
      await fetchProducts();
    } catch {
      setError("No se pudo eliminar el producto.");
    } finally {
      setConfirmDelete(null);
    }
  }

  return (
    <>
      <Helmet>
        <title>Admin · TETRUX</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <Page>
        <PageTitle>Panel de administración</PageTitle>

        {error && <ErrorBox><FiAlertTriangle style={{ marginRight: 6 }} />{error}</ErrorBox>}

        <Toolbar>
          <BtnPrimary onClick={openNew}><FiPlus /> Nuevo producto</BtnPrimary>
        </Toolbar>

        {loading ? (
          <SpinnerBox><FiLoader /> Cargando productos...</SpinnerBox>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Imagen</Th><Th>Nombre</Th><Th>Categoría</Th>
                <Th>Precio</Th><Th>Stock</Th><Th>Acciones</Th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <Td><Img src={p.image || `https://picsum.photos/seed/${p.id}/60/34`} alt={p.name} /></Td>
                  <Td style={{ color: "#e8e0ff", fontWeight: 600 }}>{p.name}</Td>
                  <Td><span style={{ background: "rgba(130,80,255,.12)", color: "#c4b0ff", borderRadius: 3, padding: "2px 8px", fontSize: ".75rem" }}>{p.category}</span></Td>
                  <Td style={{ color: "#a3ff8f", fontFamily: "monospace" }}>${Number(p.price).toFixed(2)}</Td>
                  <Td>{p.stock}</Td>
                  <Td>
                    <BtnIcon onClick={() => openEdit(p)} title="Editar"><FiEdit2 /></BtnIcon>
                    <BtnIcon $danger onClick={() => setConfirmDelete(p)} title="Eliminar"><FiTrash2 /></BtnIcon>
                  </Td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><Td colSpan={6} style={{ textAlign: "center", color: "#4a4560", padding: "2rem" }}>
                  No hay productos. Agregá uno con el botón de arriba.
                </Td></tr>
              )}
            </tbody>
          </Table>
        )}

        {formOpen && (
          <Overlay onClick={closeForm}>
            <Modal onClick={e => e.stopPropagation()}>
              <ModalTitle>{editing ? "Editar producto" : "Nuevo producto"}</ModalTitle>
              {formError && <ErrorBox style={{ marginBottom: ".75rem" }}>{formError}</ErrorBox>}
              <FormGrid>
                <FormField className="full">
                  <label>Nombre *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ej: Elden Ring" autoFocus />
                </FormField>
                <FormField>
                  <label>Precio * (USD)</label>
                  <input type="number" min="0.01" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="29.99" />
                </FormField>
                <FormField>
                  <label>Stock *</label>
                  <input type="number" min="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} placeholder="10" />
                </FormField>
                <FormField className="full">
                  <label>Categoría</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    <option value="">Sin categoría</option>
                    {CATS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </FormField>
                <FormField className="full">
                  <label>URL de imagen</label>
                  <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="https://..." />
                </FormField>
                <FormField className="full">
                  <label>Descripción</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Descripción del juego..." />
                </FormField>
              </FormGrid>
              <ModalActions>
                <BtnGhost onClick={closeForm}><FiX style={{ marginRight: 4 }} />Cancelar</BtnGhost>
                <BtnPrimary onClick={handleSave} disabled={saving}>
                  <FiCheck />{saving ? "Guardando..." : editing ? "Guardar cambios" : "Agregar producto"}
                </BtnPrimary>
              </ModalActions>
            </Modal>
          </Overlay>
        )}

        {confirmDelete && (
          <Overlay onClick={() => setConfirmDelete(null)}>
            <ConfirmModal onClick={e => e.stopPropagation()}>
              <FiAlertTriangle style={{ color: "#ff9090", fontSize: "2rem", marginBottom: ".5rem" }} />
              <ModalTitle>Eliminar producto</ModalTitle>
              <ConfirmText>
                ¿Estás seguro de que querés eliminar <strong style={{ color: "#e8e0ff" }}>{confirmDelete.name}</strong>? Esta acción no se puede deshacer.
              </ConfirmText>
              <ModalActions style={{ justifyContent: "center" }}>
                <BtnGhost onClick={() => setConfirmDelete(null)}>Cancelar</BtnGhost>
                <BtnDanger onClick={handleDelete}><FiTrash2 />Eliminar</BtnDanger>
              </ModalActions>
            </ConfirmModal>
          </Overlay>
        )}
      </Page>
    </>
  );
}