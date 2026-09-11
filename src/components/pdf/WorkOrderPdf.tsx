import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const ACCENT = "#1e293b";
const ACCENT_LIGHT = "#334155";
const SUB = "#64748b";
const BG_CARD = "#f8fafc";
const BORDER_CARD = "#e2e8f0";

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: ACCENT,
    backgroundColor: "#ffffff",
  },

  /* ENCABEZADO */
  header: {
    flexDirection: "column",
    marginBottom: 28,
    paddingBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: ACCENT,
  },

  brandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  brand: {
    flexDirection: "column",
  },

  brandName: {
    fontSize: 20,
    fontWeight: "bold",
    color: ACCENT,
    letterSpacing: 1.5,
    lineHeight: 1.2,
  },

  brandSubtitle: {
    fontSize: 9,
    color: SUB,
    marginTop: 3,
  },

  headerRight: {
    alignItems: "flex-end",
  },

  otBig: {
    fontSize: 28,
    fontWeight: "bold",
    color: ACCENT,
    letterSpacing: 2,
    lineHeight: 1,
  },

  otLabel: {
    fontSize: 8,
    color: SUB,
    letterSpacing: 0.8,
    marginTop: 4,
  },

  whatsappHeader: {
    marginTop: 10,
    fontSize: 9,
    color: SUB,
    letterSpacing: 0.3,
  },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },

  metaItem: {
    flexDirection: "column",
  },

  metaLabel: {
    fontSize: 7.5,
    color: SUB,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 2,
  },

  metaValue: {
    fontSize: 11,
    fontWeight: "bold",
    color: ACCENT,
  },

  /* SECCIONES */
  section: {
    marginBottom: 22,
  },

  sectionTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: ACCENT_LIGHT,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER_CARD,
    paddingBottom: 6,
  },

  /* TARJETA CLIENTE */
  card: {
    backgroundColor: BG_CARD,
    borderWidth: 1,
    borderColor: BORDER_CARD,
    borderRadius: 6,
    padding: 14,
  },

  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cardCol: {
    width: "48%",
  },

  cardColFull: {
    width: "100%",
  },

  cardLabel: {
    fontSize: 7.5,
    color: SUB,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 3,
  },

  cardValue: {
    fontSize: 11,
    fontWeight: "bold",
    color: ACCENT,
  },

  cardValueNormal: {
    fontSize: 10,
    color: ACCENT_LIGHT,
  },

  /* TRABAJO */
  workType: {
    fontSize: 16,
    fontWeight: "bold",
    color: ACCENT,
    letterSpacing: 0.5,
    marginBottom: 4,
  },

  workDesc: {
    fontSize: 10,
    color: ACCENT_LIGHT,
    lineHeight: 1.5,
    marginTop: 6,
  },

  tag: {
    fontSize: 8,
    color: SUB,
    backgroundColor: "#f1f5f9",
    padding: 4,
    borderRadius: 3,
    marginTop: 8,
    alignSelf: "flex-start",
  },

  /* MATERIALES */
  table: {
    width: "100%",
    borderWidth: 0.5,
    borderColor: BORDER_CARD,
    borderRadius: 4,
    overflow: "hidden",
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: ACCENT,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },

  tableHeaderText: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER_CARD,
    paddingVertical: 9,
    paddingHorizontal: 10,
    backgroundColor: "#ffffff",
  },

  tableRowAlt: {
    backgroundColor: BG_CARD,
  },

  cellMaterial: {
    width: "55%",
    fontSize: 9.5,
    color: ACCENT,
  },

  cellQty: {
    width: "22%",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    color: ACCENT,
  },

  cellUnit: {
    width: "23%",
    fontSize: 9,
    textAlign: "right",
    color: SUB,
  },

  /* OBSERVACIONES DESTACADO */
  obsBlock: {
    backgroundColor: "#fffbeb",
    borderLeftWidth: 3,
    borderLeftColor: "#f59e0b",
    borderRadius: 4,
    padding: 14,
  },

  obsText: {
    fontSize: 10,
    color: ACCENT_LIGHT,
    lineHeight: 1.55,
  },

  /* PIE */
  footer: {
    position: "absolute",
    bottom: 24,
    left: 36,
    right: 36,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 0.75,
    borderTopColor: BORDER_CARD,
    paddingTop: 10,
  },

  footerLeft: {
    fontSize: 7.5,
    color: SUB,
    letterSpacing: 0.3,
  },

  footerRight: {
    fontSize: 7.5,
    color: SUB,
    letterSpacing: 0.3,
  },
});

type WorkOrderPDFProps = {
  order: {
    number: number;
    createdAt: Date;
    status: string;
    priority: string;
    type: string;
    description: string;
    observations: string | null;
    budget: number | null;
    completedAt: Date | null;
    customer: {
      name: string;
      phone: string;
      address: string | null;
    };
    materials: {
      description: string;
      quantity: string | number;
      unit: string;
      price?: number | null;
    }[];
  };
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getStatusLabel(status: string) {
  switch (status) {
    case "COMPLETED":
      return "Finalizada";
    case "IN_PROGRESS":
      return "En proceso";
    case "CANCELLED":
      return "Cancelada";
    default:
      return "Pendiente";
  }
}

function getPriorityLabel(priority: string) {
  return priority === "URGENT" ? "Urgente" : "Normal";
}

export default function WorkOrderPDF({ order }: WorkOrderPDFProps) {
  const hasMaterialPrices = order.materials.some(
    (m) => m.price !== null && m.price !== undefined && !isNaN(Number(m.price))
  );

  const materialsTotal = order.materials.reduce((sum, m) => {
    if (m.price !== null && m.price !== undefined && !isNaN(Number(m.price))) {
      return sum + Number(m.price);
    }
    return sum;
  }, 0);

  const totalBudget = order.budget !== null && order.budget !== undefined
    ? order.budget + materialsTotal
    : (materialsTotal > 0 ? materialsTotal : null);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ENCABEZADO */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.brand}>
              <Text style={styles.brandName}>Matias Bulich</Text>
              <Text style={styles.brandSubtitle}>Electricista · Servicio técnico</Text>
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.otBig}>
                OT #{order.number.toString().padStart(5, "0")}
              </Text>
              <Text style={styles.otLabel}>ORDEN DE TRABAJO</Text>
            </View>
          </View>

          <Text style={styles.whatsappHeader}>
            WhatsApp: 351 304 2025
          </Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Fecha de emisión</Text>
              <Text style={styles.metaValue}>{formatDate(order.createdAt)}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Estado</Text>
              <Text style={styles.metaValue}>{getStatusLabel(order.status)}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Prioridad</Text>
              <Text style={styles.metaValue}>
                {getPriorityLabel(order.priority)}
              </Text>
            </View>
          </View>
        </View>

        {/* CLIENTE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos del cliente</Text>
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <View style={styles.cardCol}>
                <Text style={styles.cardLabel}>Nombre</Text>
                <Text style={styles.cardValue}>{order.customer.name}</Text>
              </View>
              <View style={styles.cardCol}>
                <Text style={styles.cardLabel}>Teléfono</Text>
                <Text style={styles.cardValueNormal}>{order.customer.phone}</Text>
              </View>
            </View>
            <View style={{ marginTop: 8 }}>
              <Text style={styles.cardLabel}>Dirección</Text>
              <Text style={styles.cardValueNormal}>
                {order.customer.address || "Sin dirección registrada"}
              </Text>
            </View>
          </View>
        </View>

        {/* TRABAJO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información del trabajo</Text>
          <Text style={styles.workType}>{order.type}</Text>
          <Text style={styles.workDesc}>{order.description}</Text>
          <Text style={styles.tag}>
            {getPriorityLabel(order.priority)} · {getStatusLabel(order.status)}
          </Text>
        </View>

        {/* MATERIALES */}
        {order.materials.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Materiales utilizados</Text>
          <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, { width: hasMaterialPrices ? "45%" : "55%" }]}>
                  Descripción
                </Text>
                <Text style={[styles.tableHeaderText, { width: hasMaterialPrices ? "16%" : "22%", textAlign: "center" }]}>
                  Cantidad
                </Text>
                <Text style={[styles.tableHeaderText, { width: hasMaterialPrices ? "16%" : "23%", textAlign: "right" }]}>
                  Unidad
                </Text>
                {hasMaterialPrices && (
                  <Text style={[styles.tableHeaderText, { width: "23%", textAlign: "right" }]}>
                    Precio
                  </Text>
                )}
              </View>
              {order.materials.map((m, i) => (
                <View
                  key={i}
                  style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}
                >
                  <Text style={[styles.cellMaterial, { width: hasMaterialPrices ? "45%" : "55%" }]}>{m.description}</Text>
                  <Text style={[styles.cellQty, { width: hasMaterialPrices ? "16%" : "22%" }]}>{m.quantity}</Text>
                  <Text style={[styles.cellUnit, { width: hasMaterialPrices ? "16%" : "23%" }]}>{m.unit || "—"}</Text>
                  {hasMaterialPrices && (
                    <Text style={{ width: "23%", textAlign: "right", fontSize: 9, color: ACCENT }}>
                      {m.price !== null && m.price !== undefined && !isNaN(Number(m.price))
                        ? `$${Number(m.price).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : "—"}
                    </Text>
                  )}
                </View>
              ))}
            </View>
        </View>
        )}

        {/* OBSERVACIONES DESTACADO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Observaciones</Text>
          <View style={styles.obsBlock}>
            <Text style={styles.obsText}>
              {order.observations || "Sin observaciones registradas."}
            </Text>
          </View>
        </View>

        {/* PRESUPUESTO */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Presupuesto</Text>
          <View style={styles.card}>
            {order.budget !== null && order.budget !== undefined && (
              <View style={styles.cardRow}>
                <Text style={styles.cardValueNormal}>Presupuesto base:</Text>
                <Text style={styles.cardValue}>
                  ${Number(order.budget).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Text>
              </View>
            )}
            {materialsTotal > 0 && (
              <View style={styles.cardRow}>
                <Text style={styles.cardValueNormal}>Materiales:</Text>
                <Text style={styles.cardValue}>
                  + ${materialsTotal.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Text>
              </View>
            )}
            {(order.budget !== null && order.budget !== undefined) || materialsTotal > 0 ? (
              <View style={[styles.cardRow, { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: BORDER_CARD }]}>
                <Text style={[styles.cardValue, { fontSize: 13 }]}>Total:</Text>
                <Text style={[styles.cardValue, { fontSize: 13, color: "#0f172a" }]}>
                  ${totalBudget !== null ? Number(totalBudget).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—"}
                </Text>
              </View>
            ) : (
              <Text style={styles.cardValueNormal}>Sin presupuesto registrado.</Text>
            )}
          </View>
        </View>

        {/* PIE */}
        <View style={styles.footer}>
          <Text style={styles.footerLeft}>
            Matias Bulich — Electricista
          </Text>
          <Text style={styles.footerRight}>
            OT #{order.number.toString().padStart(5, "0")} · WhatsApp 351 304 2025
          </Text>
        </View>
      </Page>
    </Document>
  );
}
