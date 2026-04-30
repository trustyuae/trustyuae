import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
  useMemo,
} from "react";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import Container from "react-bootstrap/Container";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Badge, Button, Card, Col, Modal, Row, Table } from "react-bootstrap";
import PrintModal from "./PrintModal";
import {
  Alert,
  Avatar,
  Box,
  GlobalStyles,
  ListItem,
  ListItemText,
  Typography,
  AccordionDetails,
  List,
  Accordion,
  AccordionSummary,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CancelIcon from "@mui/icons-material/Cancel";
import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import Webcam from "react-webcam";
import { useDispatch, useSelector } from "react-redux";
import Form from "react-bootstrap/Form";
import { CompressImage } from "../../utils/CompressImage";
import DataTable from "../DataTable";
import Loader from "../../utils/Loader";
import dayjs from "dayjs";
import ShowAlert from "../../utils/ShowAlert";
import Swal from "sweetalert2";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axiosInstance from "../../utils/AxiosInstance";
import { getUserData } from "../../utils/StorageUtils";
import {
  AddMessage,
  AttachmentFileUpload,
  CustomItemSendToChina,
  CustomOrderFinish,
  CustomOrderOH,
  InsertOrderPickup,
  InsertOrderPickupCancel,
  OrderDetailsGet,
  OverAllAttachmentFileUpload,
} from "../../Redux2/slices/OrderSystemSlice";
import {
  calculateExchange,
  updateExchangeData,
  proceedRefund,
  pushCsToAccount,
  updatePayLink,
  pushProductionCs,
  pushProToMain,
  fetchAddProductByParams,
  fetchAddProductCatalog,
  fetchAccountOrders,
  fetchCsCompletedOrders,
  fetchCsOrders,
  fetchProductionOrders,
  finishExOrder,
  updateCsProgress,
} from "../../Redux2/slices/CustomerSupportSlice";
import { getCountryName } from "../../utils/GetCountryName";
import { useDropzone } from "react-dropzone";

/** CS / account / production APIs may return `items` or grouped `items_by_category`. */
function getCsOrderLineItems(order) {
  if (!order) return [];
  if (Array.isArray(order.items) && order.items.length > 0) {
    return order.items;
  }
  const byCat = order.items_by_category;
  if (!byCat || typeof byCat !== "object") return [];
  const out = [];
  Object.keys(byCat).forEach((categoryKey) => {
    const arr = byCat[categoryKey];
    if (!Array.isArray(arr)) return;
    arr.forEach((item) => {
      out.push({ ...item, _line_category: categoryKey });
    });
  });
  return out;
}

/** Filename for `custom-finish-exorder` (basename if API only returned a URL). */
function pickFinishExOrderAttachmentFilename(item) {
  if (!item || typeof item !== "object") return "";
  const direct =
    item.attachment ??
    item.attachment_name ??
    item.attachment_filename ??
    item.finish_attachment;
  if (direct != null && String(direct).trim() !== "") {
    return String(direct).trim();
  }
  const url = item.attachment_url ?? item.order_attachment_url;
  if (url && typeof url === "string") {
    const seg = url.split("/").pop() || "";
    return seg.split("?")[0] || "";
  }
  return "";
}

function getCsOrderStatusLabel(order) {
  if (!order) return "";
  if (order.status) return order.status;
  const ibc = order.items_by_category;
  if (!ibc || typeof ibc !== "object") return "";
  const keys = Object.keys(ibc).filter(
    (k) => Array.isArray(ibc[k]) && ibc[k].length > 0
  );
  return keys.length ? keys.join(", ") : "";
}

function normalizePersonLabel(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function getOrderStartedBy(order) {
  if (!order || typeof order !== "object") return "";
  const direct = String(order.assign_user ?? order.started_by ?? "").trim();
  if (direct) return direct;

  const lines = getCsOrderLineItems(order);
  const lineAssigned = lines.find(
    (item) => String(item?.assign_user ?? item?.started_by ?? "").trim() !== ""
  );
  return String(
    lineAssigned?.assign_user ?? lineAssigned?.started_by ?? ""
  ).trim();
}

function extractFinalNoteEntriesFromItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return [{ user: "N/A", message: "—" }];
  }
  const raw = items.find((it) => String(it?.final_note ?? "").trim() !== "")
    ?.final_note;
  if (!raw) return [{ user: "N/A", message: "—" }];
  if (typeof raw !== "string") {
    return [{ user: "N/A", message: String(raw) }];
  }
  const trimmed = raw.trim();
  if (!trimmed) return [{ user: "N/A", message: "—" }];
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      const entries = parsed
        .map((entry) => ({
          user: String(entry?.user ?? "").trim() || "N/A",
          message: String(entry?.message ?? "").trim() || "—",
        }))
        .filter((entry) => entry.user !== "N/A" || entry.message !== "—");
      return entries.length ? entries : [{ user: "N/A", message: "—" }];
    }
    if (parsed && typeof parsed === "object") {
      return [
        {
          user: String(parsed.user ?? "").trim() || "N/A",
          message: String(parsed.message ?? "").trim() || "—",
        },
      ];
    }
    return [{ user: "N/A", message: trimmed }];
  } catch (_) {
    return [{ user: "N/A", message: trimmed }];
  }
}

function pickProductFromAddProductPayload(data) {
  if (!data) return null;
  if (Array.isArray(data.products) && data.products.length > 0) {
    return data.products[0];
  }
  if (data.product && typeof data.product === "object") {
    return data.product;
  }
  return null;
}

function formatVariationAttributesLabel(attributes) {
  if (!attributes || typeof attributes !== "object") return "";
  return Object.entries(attributes)
    .map(([k, v]) => `${k}: ${v}`)
    .join(", ");
}

function hasProductVariations(product) {
  if (!product) return false;
  if (Array.isArray(product.variation_ids) && product.variation_ids.length > 0) {
    return true;
  }
  const vd = product.variation_details;
  return (
    vd != null &&
    typeof vd === "object" &&
    Object.keys(vd).length > 0
  );
}

function pickPriceAndLinkFromProduct(product, variationId) {
  if (!product) return { price: "", link: "" };
  const vid = variationId != null && variationId !== "" ? String(variationId) : "";
  if (vid && product.variation_details?.[vid]) {
    const vd = product.variation_details[vid];
    return {
      price: vd.price != null ? String(vd.price) : "",
      link: vd.permalink || "",
    };
  }
  return {
    price: product.price != null ? String(product.price) : "",
    link: product.product_permalink || "",
  };
}

function formatExchangeMoney(value) {
  if (value === null || value === undefined || value === "") return "—";
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Parse money for arithmetic; `null` if missing / not a number. */
function safeMoneyNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  if (Number.isNaN(n)) return null;
  return n;
}

/** Parse user-typed money for sums; empty → 0, invalid → 0. */
function parseLooseMoneyAmount(str) {
  const s = String(str ?? "").trim().replace(/,/g, "");
  if (s === "") return 0;
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

/** Monetary fields sent to `update-exchange-data` (2 decimal places). */
function roundExchangeApiMoney(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return 0;
  return Math.round(n * 100) / 100;
}

/** Prefer non-zero ref (refund) vs ext (extra charge); API returns ref_price_difference / ext_price_difference. */
function getExchangeFinalAmountFromDifferences(data) {
  if (!data) return null;
  if (data.final_amount != null && data.final_amount !== "") {
    const f = Number(data.final_amount);
    if (!Number.isNaN(f)) return f;
  }
  const ref = data.ref_price_difference;
  const ext = data.ext_price_difference;
  const r = ref != null && ref !== "" ? Number(ref) : 0;
  const e = ext != null && ext !== "" ? Number(ext) : 0;
  if (Number.isNaN(r) && Number.isNaN(e)) return null;
  if (!Number.isNaN(r) && r !== 0) return r;
  if (!Number.isNaN(e) && e !== 0) return e;
  return !Number.isNaN(r) ? r : !Number.isNaN(e) ? e : null;
}

const PUSH_TO_P2_PROD_TIME_CUSTOM = "__custom__";

function OrderDetails() {
  const { id } = useParams();
  const fileInputRef = useRef({});
  const dropzoneRef = useRef(null);
  const [orderData, setOrderData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [selectedVariationId, setSelectedVariationId] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const [orderProcess, setOrderProcess] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAttachModal, setShowAttachModal] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedFileUrl, setSelectedFileUrl] = useState(null);
  const webcamRef = useRef(null);
  const [showMessageModal, setshowMessageModal] = useState(false);
  const [showMessageOHModal, setshowMessageOHModal] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [message, setMessage] = useState("");
  /** CS default view: Add Note modal — only `note`; API `progress` sent as empty string. */
  const [csNoteBody, setCsNoteBody] = useState("");
  const [csAddNoteLoading, setCsAddNoteLoading] = useState(false);
  const [messageOH, setOHMessage] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [userData, setUserData] = useState(null);
  const [uploadImageModalOpen, setUploadImageModalOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const isCsView = searchParams.get("cs") === "1";
  const isAccountCsView = isCsView && searchParams.get("account") === "1";
  const isPendingCsReadonlyView =
    isAccountCsView && searchParams.get("pending") === "1";
  const isProductionCsView = isCsView && searchParams.get("production") === "1";
  /** Complete orders list — `?cs=1&complete=1` (data from `cs-completed`, not active `cs-orders`). */
  const isCsCompletedView =
    isCsView && searchParams.get("complete") === "1";
  /** Customer order support list (`?cs=1` only), not Account / Production / Complete CS. */
  const isDefaultCustomerSupportView =
    isCsView &&
    !isAccountCsView &&
    !isProductionCsView &&
    !isCsCompletedView;
  const [csSelectedLineRowId, setCsSelectedLineRowId] = useState(null);
  const [csPushAccountLoading, setCsPushAccountLoading] = useState(false);
  const [showCsPushAccountModal, setShowCsPushAccountModal] = useState(false);
  const [showAccountPayLinkModal, setShowAccountPayLinkModal] =
    useState(false);
  const [accountPayLinkInput, setAccountPayLinkInput] = useState("");
  const [accountPayLinkExtraChargesInput, setAccountPayLinkExtraChargesInput] =
    useState("");
  const [accountPayLinkLoading, setAccountPayLinkLoading] = useState(false);
  const [csPushAccountReason, setCsPushAccountReason] = useState("");
  const [csPushAccountNote, setCsPushAccountNote] = useState("");
  const [csPushAccountCategory, setCsPushAccountCategory] = useState("Refund");
  const [csPushProductionLoading, setCsPushProductionLoading] = useState(false);
  const [showCsPushProductionModal, setShowCsPushProductionModal] =
    useState(false);
  const [csPushProductionReason, setCsPushProductionReason] = useState("");
  const [csPushProductionNote, setCsPushProductionNote] = useState("");
  const [csPushProductionStatus, setCsPushProductionStatus] =
    useState("No Respond");
  const [showReplaceProductModal, setShowReplaceProductModal] =
    useState(false);
  const [replaceModalProductId, setReplaceModalProductId] = useState("");
  const [replaceModalVariationId, setReplaceModalVariationId] = useState("");
  const [replaceModalLink, setReplaceModalLink] = useState("");
  const [replaceModalPrice, setReplaceModalPrice] = useState("");
  const [replaceModalReason, setReplaceModalReason] = useState("");
  const [replaceModalNote, setReplaceModalNote] = useState("");
  const [replaceProductSnapshot, setReplaceProductSnapshot] = useState(null);
  const [exchangePaymentData, setExchangePaymentData] = useState(null);
  /** Manual charge entered in Replace Product payment table. */
  const [replaceModalManualCharges, setReplaceModalManualCharges] = useState("");
  /** Replacement product permalink captured when exchange is calculated (for update-exchange-data). */
  const [exchangeExItemLink, setExchangeExItemLink] = useState("");
  /** True after Replace Product modal Done succeeds (`update-exchange-data`); required before Finish Order. */
  const [exchangeDoneSaved, setExchangeDoneSaved] = useState(false);
  const [exchangeCalculateLoading, setExchangeCalculateLoading] =
    useState(false);
  const [finishRefundLoading, setFinishRefundLoading] = useState(false);
  const [showFinishRefundModal, setShowFinishRefundModal] = useState(false);
  const [finishRefundBaseAmount, setFinishRefundBaseAmount] = useState("");
  const [finishRefundExtraCharge, setFinishRefundExtraCharge] = useState("0.00");
  const [finishRefundNoteInput, setFinishRefundNoteInput] = useState("");
  const [finishRefundAttachment, setFinishRefundAttachment] = useState(null);
  const [finishRefundAttachmentPreviewUrl, setFinishRefundAttachmentPreviewUrl] =
    useState("");
  const finishRefundFileInputRef = useRef(null);
  const [updateExchangeDataLoading, setUpdateExchangeDataLoading] =
    useState(false);
  const [showPushToP2Modal, setShowPushToP2Modal] = useState(false);
  const [pushToP2Reason, setPushToP2Reason] = useState("Move to production");
  const [pushToP2Note, setPushToP2Note] = useState("Approved for production");
  const [pushToP2Category, setPushToP2Category] = useState("Production");
  const [pushToP2ProdTimePreset, setPushToP2ProdTimePreset] =
    useState("7/10 Days");
  const [pushToP2ProdTimeCustom, setPushToP2ProdTimeCustom] = useState("");
  const [pushToP2Loading, setPushToP2Loading] = useState(false);
  const [finishCollectCustomerLoading, setFinishCollectCustomerLoading] =
    useState(false);
  /** Finish (exchange) — modal to upload `attachment` before `finish-ex-order`. */
  const [showFinishExOrderAttachmentModal, setShowFinishExOrderAttachmentModal] =
    useState(false);
  const [pendingFinishExOrderPayStatus, setPendingFinishExOrderPayStatus] =
    useState("collect-customer");
  const [finishExOrderAttachmentFile, setFinishExOrderAttachmentFile] =
    useState(null);
  const [finishExOrderAttachmentPreviewUrl, setFinishExOrderAttachmentPreviewUrl] =
    useState("");
  const finishExOrderFileInputRef = useRef(null);
  const [finishExOrderBaseAmount, setFinishExOrderBaseAmount] = useState("");
  const [finishExOrderExtraCharge, setFinishExOrderExtraCharge] = useState("");
  const [finishExOrderNote, setFinishExOrderNote] = useState("");
  const [showCompletedFinalNoteModal, setShowCompletedFinalNoteModal] =
    useState(false);
  const [completedFinalNoteEntries, setCompletedFinalNoteEntries] = useState([
    { user: "N/A", message: "—" },
  ]);
  const [attachmentZoom, setAttachmentZoom] = useState(false);

  useEffect(() => {
    if (!finishExOrderAttachmentFile) {
      setFinishExOrderAttachmentPreviewUrl("");
      return undefined;
    }
    const url = URL.createObjectURL(finishExOrderAttachmentFile);
    setFinishExOrderAttachmentPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [finishExOrderAttachmentFile]);

  useEffect(() => {
    if (!finishRefundAttachment) {
      setFinishRefundAttachmentPreviewUrl("");
      return undefined;
    }
    const url = URL.createObjectURL(finishRefundAttachment);
    setFinishRefundAttachmentPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [finishRefundAttachment]);

  const [attachmentsubmitbtn, setAttachmentsubmitbtn] = useState(false);

  const loader = useSelector((state) => state?.orderSystem?.isLoading);
  if (!fileInputRef.current) {
    fileInputRef.current = {};
  }
  fileInputRef.current[
    selectedVariationId ? selectedVariationId : selectedItemId
  ] = useRef(null);

  const AddInOnHold = useSelector((state) => state?.orderSystem?.isLoading);

  const Finished = useSelector((state) => state?.orderSystem?.isLoading);

  const orderDetailsDataOrderId = useSelector(
    (state) => state?.orderSystem?.orderDetailsData?.orders?.[0]
  );

  const orderDetailsData = useSelector(
    (state) => state?.orderSystem?.orderDetailsData
  );

  const CustomOrderOHDataa = useSelector(
    (state) => state?.orderSystem?.customOrderOnHoldData
  );

  const csOrders = useSelector((state) => state?.customerSupport?.csOrders ?? []);
  const csLoading = useSelector((state) => state?.customerSupport?.isLoading);
  const accountOrders = useSelector(
    (state) => state?.customerSupport?.accountOrders ?? []
  );
  const accountOrdersLoading = useSelector(
    (state) => state?.customerSupport?.isAccountOrdersLoading
  );
  const productionOrders = useSelector(
    (state) => state?.customerSupport?.productionOrders ?? []
  );
  const productionOrdersLoading = useSelector(
    (state) => state?.customerSupport?.isProductionOrdersLoading
  );
  const csCompletedOrders = useSelector(
    (state) => state?.customerSupport?.csCompletedOrders ?? []
  );
  const isCsCompletedOrdersLoading = useSelector(
    (state) => state?.customerSupport?.isCsCompletedOrdersLoading
  );
  const addProductCatalog = useSelector(
    (state) => state?.customerSupport?.addProductCatalog ?? []
  );
  const addProductCatalogLoading = useSelector(
    (state) => state?.customerSupport?.addProductCatalogLoading
  );
  const addProductSelectionLoading = useSelector(
    (state) => state?.customerSupport?.addProductSelectionLoading
  );
  const csDetailLoading = isAccountCsView
    ? accountOrdersLoading
    : isProductionCsView
    ? productionOrdersLoading
    : isCsCompletedView
    ? isCsCompletedOrdersLoading
    : csLoading;

  const csOrderDetail = useMemo(() => {
    if (!isCsView) return null;
    if (isCsCompletedView) {
      const list = csCompletedOrders;
      if (!list?.length) return null;
      return (
        list.find((o) => String(o.order_id) === String(id)) ||
        list[0] ||
        null
      );
    }
    const list = isAccountCsView
      ? accountOrders
      : isProductionCsView
      ? productionOrders
      : csOrders;
    if (!list?.length) return null;
    return (
      list.find((o) => String(o.order_id) === String(id)) || list[0] || null
    );
  }, [
    isCsView,
    isCsCompletedView,
    isAccountCsView,
    isProductionCsView,
    csOrders,
    csCompletedOrders,
    accountOrders,
    productionOrders,
    id,
  ]);

  /** Account CS: show Finish Refund only for Refund, not Exchange. */
  const isAccountRefundOrder = useMemo(() => {
    if (!isAccountCsView || !csOrderDetail) return false;
    const direct = (csOrderDetail.status || "")
      .toString()
      .trim()
      .toLowerCase();
    if (direct === "exchange") return false;
    if (direct === "refund") return true;
    const label = (getCsOrderStatusLabel(csOrderDetail) || "")
      .trim()
      .toLowerCase();
    if (label === "exchange") return false;
    return label === "refund";
  }, [isAccountCsView, csOrderDetail]);

  /** Account CS: Exchange line with `pay_status` collect-customer — show Push to CS. */
  const showAccountPushToCsCollectCustomer = useMemo(() => {
    if (!isAccountCsView || !csOrderDetail) return false;
    const lines = getCsOrderLineItems(csOrderDetail);
    return lines.some((item) => {
      const cat = String(item._line_category ?? "").trim().toLowerCase();
      if (cat !== "exchange") return false;
      const pay = String(item.pay_status ?? "").trim().toLowerCase();
      return pay === "collect-customer";
    });
  }, [isAccountCsView, csOrderDetail]);

  /**
   * Account CS (`?cs=1&account=1`): Exchange line `pay_status` pay-customer — show Finish.
   * If any exchange line is collect-customer, Push to CS takes precedence.
   */
  const showAccountExchangePayCustomerFinish = useMemo(() => {
    if (!isAccountCsView || !csOrderDetail || isAccountRefundOrder) return false;
    const lines = getCsOrderLineItems(csOrderDetail);
    const hasCollect = lines.some((item) => {
      const cat = String(item._line_category ?? "").trim().toLowerCase();
      if (cat !== "exchange") return false;
      return (
        String(item.pay_status ?? "").trim().toLowerCase() ===
        "collect-customer"
      );
    });
    if (hasCollect) return false;
    return lines.some((item) => {
      const cat = String(item._line_category ?? "").trim().toLowerCase();
      if (cat !== "exchange") return false;
      return (
        String(item.pay_status ?? "").trim().toLowerCase() === "pay-customer"
      );
    });
  }, [isAccountCsView, csOrderDetail, isAccountRefundOrder]);

  /**
   * Default CS (`?cs=1` only): any line `pay_status` collect-customer — footer shows
   * Finish only (hide Add Note / Push to Account / Push to Production / Push to P2).
   */
  const csDefaultSupportCollectCustomer = useMemo(() => {
    if (!isDefaultCustomerSupportView || !csOrderDetail) return false;
    const lines = getCsOrderLineItems(csOrderDetail);
    return lines.some((item) => {
      const pay = String(item.pay_status ?? "").trim().toLowerCase();
      return pay === "collect-customer";
    });
  }, [isDefaultCustomerSupportView, csOrderDetail]);

  const isAssignedUserLoggedInForCsStart = useMemo(() => {
    if (!isDefaultCustomerSupportView || !csOrderDetail) return false;
    const assigned = normalizePersonLabel(getOrderStartedBy(csOrderDetail));
    if (!assigned) return false;

    const candidates = new Set(
      [
        userData?.name,
        userData?.display_name,
        userData?.user_login,
        userData?.username,
        userData?.user_nicename,
        [userData?.first_name, userData?.last_name].filter(Boolean).join(" "),
        userData?.first_name,
      ]
        .map(normalizePersonLabel)
        .filter(Boolean)
    );
    return candidates.has(assigned);
  }, [isDefaultCustomerSupportView, csOrderDetail, userData]);

  const csItemsTableRows = useMemo(() => {
    const raw = getCsOrderLineItems(csOrderDetail);
    if (!raw.length) return [];
    return raw.map((item, idx) => ({
      ...item,
      id: idx,
      item_id: item.product_id ?? item.item_id,
    }));
  }, [csOrderDetail]);

  /** Push to CS modal (account): preview values from selected/current line. */
  const accountPayLinkPreviewRow = useMemo(() => {
    if (!isAccountCsView || !csItemsTableRows.length) return null;
    if (csItemsTableRows.length > 1) {
      if (csSelectedLineRowId == null) return null;
      return csItemsTableRows.find((r) => r.id === csSelectedLineRowId) || null;
    }
    return csItemsTableRows[0];
  }, [isAccountCsView, csItemsTableRows, csSelectedLineRowId]);

  const accountPayLinkFinalAmountText = useMemo(() => {
    const row = accountPayLinkPreviewRow;
    if (!row) return "—";
    const payStatusRaw = String(row.pay_status ?? "").trim();
    const payStatus = (() => {
      const key = payStatusRaw.toLowerCase();
      if (key === "collect-customer") return "Collect from customer";
      if (key === "pay-customer") return "Pay to customer";
      return payStatusRaw;
    })();
    const base = safeMoneyNumber(row.final_amount);
    const extraN = parseLooseMoneyAmount(accountPayLinkExtraChargesInput);
    if (base == null && extraN === 0) {
      return payStatus || "—";
    }
    const total = (base ?? 0) + extraN;
    const amountText = formatExchangeMoney(total);
    if (payStatus && amountText !== "—") return `${payStatus} ${amountText}`;
    if (amountText !== "—") return amountText;
    return payStatus || "—";
  }, [accountPayLinkPreviewRow, accountPayLinkExtraChargesInput]);

  /**
   * Exchange details table: Account CS — all lines; Default CS (`?cs=1`) — only lines
   * with `pay_status` collect-customer.
   */
  const csExchangeDetailTableRows = useMemo(() => {
    if (!csOrderDetail) return [];
    const raw = getCsOrderLineItems(csOrderDetail);
    if (!raw.length) return [];

    const mapExc = (item, idx) => ({
      id: idx,
      exc_item_id: item.exc_item_id ?? "",
      exc_item_name: item.exc_item_name ?? "",
      exc_variation: item.exc_variation ?? "",
      exc_amount: item.exc_amount ?? "",
      exc_image: item.exc_image ?? "",
      exc_quantity: item.exc_quantity ?? "",
    });

    if (isAccountCsView) {
      return raw.map((item, idx) => mapExc(item, idx));
    }

    if (isDefaultCustomerSupportView) {
      const collectLines = raw.filter(
        (item) =>
          String(item.pay_status ?? "").trim().toLowerCase() ===
          "collect-customer"
      );
      return collectLines.map((item, idx) => mapExc(item, idx));
    }

    return [];
  }, [isAccountCsView, isDefaultCustomerSupportView, csOrderDetail]);

  const activeReplaceProduct = useMemo(() => {
    if (replaceProductSnapshot) return replaceProductSnapshot;
    if (!replaceModalProductId) return null;
    return (
      addProductCatalog.find(
        (p) => String(p.product_id) === String(replaceModalProductId)
      ) || null
    );
  }, [replaceProductSnapshot, replaceModalProductId, addProductCatalog]);

  const replaceVariationOptions = useMemo(() => {
    const p = activeReplaceProduct;
    if (!p) return [];
    const vd = p.variation_details;
    if (vd && typeof vd === "object" && Object.keys(vd).length > 0) {
      return Object.entries(vd).map(([vid, det]) => ({
        id: vid,
        label:
          formatVariationAttributesLabel(det?.attributes) || `Variation ${vid}`,
      }));
    }
    if (Array.isArray(p.variation_ids) && p.variation_ids.length > 0) {
      return p.variation_ids.map((vid) => ({
        id: String(vid),
        label: `Variation ID: ${vid}`,
      }));
    }
    return [];
  }, [activeReplaceProduct]);

  useEffect(() => {
    setCsSelectedLineRowId(null);
  }, [id, csOrderDetail?.order_id]);

  useEffect(() => {
    if (csItemsTableRows.length <= 1) {
      setCsSelectedLineRowId(null);
    }
  }, [csItemsTableRows.length]);

  useEffect(() => {
    if (!isCsView || !csOrderDetail) return;
    const items = getCsOrderLineItems(csOrderDetail);
    setOrderData([{ ...csOrderDetail, items, id: 0 }]);
  }, [isCsView, csOrderDetail]);

  useEffect(() => {
    if (!showMessageModal || !isDefaultCustomerSupportView) return;
    setCsNoteBody("");
  }, [showMessageModal, isDefaultCustomerSupportView]);

  async function fetchUserData() {
    try {
      const userdata = await getUserData();
      setUserData(userdata || {});
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    if (isCsView) return;
    // Check if we have order data
    if (orderDetailsDataOrderId && orderDetailsData) {
      const orderIdFromData = orderDetailsDataOrderId.order_id?.toString();
      const currentOrderId = id?.toString();
      
      // Only update state if the order data matches the current order ID
      if (orderIdFromData === currentOrderId) {
        const oDetails = orderDetailsData?.orders?.map((v, i) => ({ ...v, id: i }));
        setOrderData(oDetails || []);

        setOrderDetails(orderDetailsDataOrderId);
        setOrderProcess(orderDetailsDataOrderId.order_process);

        if (Array.isArray(orderDetailsDataOrderId.items)) {
          const newData = orderDetailsDataOrderId.items.map(
            (product, index1) => ({
              ...product,
              id: index1,
            })
          );
          setTableData(newData);
        } else {
          console.warn("orderDetailsDataOrderId.items is not an array");
          setTableData([]);
        }
      } else if (orderIdFromData && currentOrderId && orderIdFromData !== currentOrderId) {
        // If data exists but doesn't match current ID, reset state (waiting for correct data)
        // Only reset if we're not currently loading (to avoid flickering)
        if (!loader) {
          setOrderDetails(null);
          setOrderProcess(null);
          setTableData([]);
          setOrderData([]);
        }
      }
    } else if (!orderDetailsData && id && !loader) {
      // If no data exists but we have an ID and not loading, reset state
      // (This handles the case where data failed to load or was cleared)
      setOrderDetails(null);
      setOrderProcess(null);
      setTableData([]);
      setOrderData([]);
    }
  }, [orderDetailsData, orderDetailsDataOrderId, id, loader, isCsView]);

  async function fetchOrder() {
    try {
      dispatch(OrderDetailsGet(id));
    } catch (error) {
      console.error(error);
    }
  }

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setSelectedFileUrl(imageSrc);
    setShowAttachModal(false);
    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const uniqueFilename = `screenshot_${Date.now()}.jpg`;
        const file = new File([blob], uniqueFilename, {
          type: "image/jpeg",
        });
        setSelectedFile(file);
      })
      .catch((error) => {
        console.error("Error converting data URL to file:", error);
      });
    setShowAttachmentModal(true);
  }, [webcamRef]);

  const retake = () => {
    setSelectedFileUrl(null);
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleAddMessage = async (e) => {
    const requestedMessage = {
      message: message,
      order_id: parseInt(id, 10),
      name: userData?.first_name || "user",
    };
    await dispatch(AddMessage(requestedMessage)).then(async ({ payload }) => {
      if (payload) {
        setMessage("");
        setshowMessageModal(false);
        ShowAlert("", payload, "success", null, null, null, null, 3000);
      }
      if (isCsView) {
        if (isAccountCsView) {
          const url = `wp-json/custom-account-orders/v1/account-orders/?page=1&per_page=1&order_id=${encodeURIComponent(
            id
          )}`;
          await dispatch(fetchAccountOrders({ apiUrl: url }));
        } else if (isProductionCsView) {
          const url = `wp-json/custom-pro-orders/v1/pro-orders/?page=1&per_page=1&order_id=${encodeURIComponent(
            id
          )}`;
          await dispatch(fetchProductionOrders({ apiUrl: url }));
        }
      } else {
        await fetchOrder();
      }
    });
  };

  const handleCsAddNoteSubmit = async () => {
    const note = csNoteBody.trim();
    if (!note) {
      ShowAlert("", "Please enter a note.", "warning", true);
      return;
    }
    const ticketRaw =
      csOrderDetail?.ticket_id ?? csOrderDetail?.cs_ticket_id;
    const ticket_id = Number(ticketRaw);
    const order_id = Number(csOrderDetail?.order_id ?? id);
    if (ticketRaw == null || ticketRaw === "" || Number.isNaN(ticket_id)) {
      ShowAlert("", "Missing ticket ID for this order.", "error", true);
      return;
    }
    if (Number.isNaN(order_id)) {
      ShowAlert("", "Invalid order ID.", "error", true);
      return;
    }
    setCsAddNoteLoading(true);
    try {
      const data = await dispatch(
        updateCsProgress({
          ticket_id,
          order_id,
          progress: "",
          note,
        })
      ).unwrap();
      const msg =
        (typeof data === "string" ? data : null) ||
        data?.message ||
        "Progress updated.";
      ShowAlert("", String(msg), "success", null, null, null, null, 3000);
      setCsNoteBody("");
      setshowMessageModal(false);
      const url = `wp-json/custom-cs-orders/v1/cs-orders/?page=1&per_page=1&order_id=${encodeURIComponent(
        id
      )}`;
      await dispatch(fetchCsOrders({ apiUrl: url }));
    } catch (err) {
      ShowAlert("", String(err), "error", true);
    } finally {
      setCsAddNoteLoading(false);
    }
  };

  const submitOH = async () => {
    try {
      const result = {
        order_id: parseInt(orderDetails.order_id, 10),
        onhold_status: 1,
        item_id: [],
        variation_id: [],
        user_id: parseInt(orderDetails.user_id, 10),
        operation_user_id: parseInt(orderDetails.operation_user_id, 10),
        onhold_note: messageOH,
      };
      orderDetails.items.forEach((item) => {
        result.item_id.push(parseInt(item.item_id, 10));
        result.variation_id.push(parseInt(item.variation_id, 10));
      });
      dispatch(CustomOrderOH(result));
      if (CustomOrderOHDataa.status === 200) {
        setOHMessage("");
        setshowMessageOHModal(false);
        ShowAlert(
          "",
          CustomOrderOHDataa.data.message,
          "success",
          null,
          null,
          null,
          null,
          2000
        );
        navigate("/on_hold_orders_system");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Reset selection-related state when order ID changes (but not order data - let useLayoutEffect handle that)
  useEffect(() => {
    setSelectedItems([]);
    setSelectedItemIds([]);
    setSelectedFileUrl(null);
    setSelectedFile(null);
    setExchangePaymentData(null);
    setReplaceModalManualCharges("");
    setExchangeExItemLink("");
    setExchangeDoneSaved(false);
  }, [id]);

  useEffect(() => {
    if (!id || isCsView) return;
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isCsView]);

  useEffect(() => {
    if (!isCsView || !id) return;
    if (isAccountCsView) {
      const url = `wp-json/custom-account-orders/v1/account-orders/?page=1&per_page=1&order_id=${encodeURIComponent(
        id
      )}`;
      dispatch(fetchAccountOrders({ apiUrl: url }));
    } else if (isProductionCsView) {
      const url = `wp-json/custom-pro-orders/v1/pro-orders/?page=1&per_page=1&order_id=${encodeURIComponent(
        id
      )}`;
      dispatch(fetchProductionOrders({ apiUrl: url }));
    } else if (isCsCompletedView) {
      const url = `wp-json/custom-completed-orders/v1/cs-completed/?page=1&per_page=1&order_id=${encodeURIComponent(
        id
      )}`;
      dispatch(fetchCsCompletedOrders({ apiUrl: url }));
    } else {
      const url = `wp-json/custom-cs-orders/v1/cs-orders/?page=1&per_page=1&order_id=${encodeURIComponent(
        id
      )}`;
      dispatch(fetchCsOrders({ apiUrl: url }));
    }
  }, [
    isCsView,
    isAccountCsView,
    isProductionCsView,
    isCsCompletedView,
    id,
    dispatch,
  ]);

  const ImageModule = (url) => {
    setImageURL(url);
    setShowEditModal(true);
  };

  const handlePrint = () => {
    setShowModal(true);
  };

  const handleFileInputChange = async (e, itemId, itemVariationId) => {
    if (e.files[0]) {
      const file = await CompressImage(e.files[0]);
      const fr = new FileReader();
      fr.onload = function () {
        setSelectedFileUrl(fr.result);
        setSelectedFile(file);
        setShowAttachmentModal(true);
        setUploadImageModalOpen(false);
        setSelectedItemId(itemId);
        setSelectedVariationId(itemVariationId);
      };
      fr.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    noClick: true,
  });

  const handleCancel = () => {
    setSelectedFileUrl(null);
    setSelectedFile(null);
    setShowAttachmentModal(false);
  };

  const handleCancelImg = async (e) => {
    Swal.fire({
      title: "Are you sure you want to delete this image?",
      icon: "question",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axiosInstance.post(
          `wp-json/order-complete-attachment/v1/delete-attachment/${id}/${e.item_id}`,
          {
            variation_id: e.variation_id,
            image_url: e.dispatch_image,
          }
        );
        fetchOrder();
      }
    });
  };

  const handleSubmitAttachment = async () => {
    setAttachmentsubmitbtn(true);
    try {
      const { user_id } = userData ?? {};
      if (selectedItemId) {
        dispatch(
          AttachmentFileUpload({
            user_id: user_id,
            order_id: id,
            item_id: selectedItemId,
            variation_id: selectedVariationId,
            selectedFile: selectedFile,
          })
        );
      } else {
        dispatch(
          OverAllAttachmentFileUpload({
            order_id: orderDetailsDataOrderId?.order_id,
            order_dispatch_image: selectedFile,
          })
        );
      }
      setShowAttachmentModal(false);
      setSelectedFile(null);
      const result = await ShowAlert(
        "",
        "Uploaded Successfully!",
        "success",
        null,
        null,
        null,
        null,
        2000
      );
      if (result.isConfirmed) handleCancel();
      fetchOrder();
      setAttachmentsubmitbtn(false);
    } catch (error) {
      console.error(error);
      setAttachmentsubmitbtn(false);
    }
  };

  const handleStartOrderProcess = () => {
    if (isCsView && !isAssignedUserLoggedInForCsStart) {
      ShowAlert(
        "",
        "Only assigned user can start this order.",
        "warning",
        true
      );
      return;
    }
    const requestData = {
      order_id: Number(id),
      user_id: userData.user_id,
      start_time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      end_time: "",
      order_status: "started",
    };
    dispatch(InsertOrderPickup(requestData)).then(() => {
      fetchOrder();
    });
  };

  const handleCancelOrderProcess = async () => {
    const requestData = {
      order_id: parseInt(id, 10),
      operation_id: orderDetails?.operation_user_id,
      order_status: "Cancelled",
    };
    dispatch(InsertOrderPickupCancel(requestData)).then(() => {
      fetchOrder();
    });
  };

  const handleItemSelection = (rowData) => {
    const selectedIndex = selectedItemIds.indexOf(rowData.id);
    const newSelected =
      selectedIndex !== -1
        ? selectedItemIds.filter((id) => id !== rowData.id)
        : [...selectedItemIds, rowData.id];

    if (selectedIndex === -1) {
      setSelectedItems([...selectedItems, rowData]);
    } else {
      setSelectedItems(selectedItems.filter((item) => item.id !== rowData.id));
    }
    setSelectedItemIds(newSelected);
  };

  const handleSendToChinaSystem = async () => {
    const selectedProductIds = selectedItems.map((item) => item.item_id);
    const selectedVariationIds = selectedItems.map((item) => item.variation_id);

    const payload = {
      product_id: selectedProductIds,
      variation_id: selectedVariationIds,
      warehouse: "China",
    };

    try {
      dispatch(CustomItemSendToChina({ id, payload })).then(({ payload }) => {
        Swal.fire({
          title: payload,
          icon: payload ? "success" : "error",
          showConfirmButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/ordersystem_in_china");
          }
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleFinishButtonClick = async () => {
    try {
      const { user_id } = userData ?? {};
      dispatch(CustomOrderFinish({ user_id, id })).then(({ payload }) => {
        Swal.fire({
          title: payload.message,
          icon: payload.status_code === 200 ? "success" : "error",
          showConfirmButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/ordersystem");
          }
        });
      });
    } catch (error) {
      console.error("Error while finishing order:", error);
    }
  };

  const variant = (variations) => {
    const matches = variations.match(
      /"display_key";s:\d+:"([^"]+)";s:\d+:"display_value";s:\d+:"([^"]+)";/
    );
    if (matches) {
      const key = matches[1];
      const value = matches[2].replace(/<[^>]*>/g, ""); // Remove HTML tags
      return `${key}: ${value}`;
    } else {
      return "Variant data not available";
    }
  };

  const variant2 = (variations) => {
    const { Color, Size } = variations;

    if (!Color && !Size) {
      return "Variant data not available";
    }

    let details = [];

    if (Size) {
      details.push(`Size: ${Size}`);
    }

    if (Color) {
      details.push(`Color: ${Color}`);
    }

    return details.join(", ");
  };

  const columns = [
    {
      field: "select",
      headerName: "Select",
      flex: 0.5,
      renderCell: (params) => {
        return (
          <FormGroup>
            <FormControlLabel
              className="mx-auto"
              control={<Checkbox />}
              style={{ justifyContent: "center" }}
              checked={selectedItemIds.includes(params.row.id)}
              onChange={(event) => handleItemSelection(params.row)}
            />
          </FormGroup>
        );
      },
    },
    {
      field: "item_id",
      headerName: "Item Id",
      className: "order-details",
      flex: 0.5,
    },
    {
      field: "product_name",
      headerName: "Name",
      className: "order-details",
      flex: 1.5,
      renderCell: (params) => {
        const nameToShow = params.row.product_eng_name || params.row.product_name;
        return nameToShow || "N/A"; // fallback if both are missing
      },
    },
    {
      field: "variant_details",
      headerName: "Variant Details",
      className: "order-details",
      flex: 1.5,
      renderCell: (params) => {
        if (
          params.row.variations &&
          Object.keys(params.row.variations).length !== 0
        ) {
          return variant2(params.row.variations);
        } else if (
          params.row.variation_value &&
          params.row.variation_value !== ""
        ) {
          return variant(params.row.variation_value);
        } else {
          return "No variations available";
        }
      },
    },
    {
      field: "product_image",
      headerName: "Image",
      flex: 1,
      className: "order-details",
      renderCell: (params) => (
        <Box
          className="h-100 w-100 d-flex align-items-center"
          onClick={() => {
            ImageModule(params?.value);
            setAttachmentZoom(false);
          }}
        >
          <Avatar
            src={params.value || require("../../assets/default.png")}
            alt="Product Image"
            sx={{
              height: "45px",
              width: "45px",
              borderRadius: "2px",
              margin: "0 auto",
              "& .MuiAvatar-img": {
                height: "100%",
                width: "100%",
                borderRadius: "2px",
              },
            }}
          />
        </Box>
      ),
    },
    {
      field: "quantity",
      headerName: "QTY",
      flex: 0.5,
      className: "order-details",
    },
    {
      field: "avl_quantity",
      headerName: "Avl QTY",
      flex: 0.5,
    },
    {
      field: "dispatch_type",
      headerName: "Status",
      flex: 0.5,
      className: "order-details",
      type: "string",
    },
    {
      field: "dispatch_image",
      headerName: "Attachment",
      flex: 1.5,
      className: "order-details",
      type: "html",
      renderCell: (value, row) => {
        const itemId = value && value.row.item_id ? value.row.item_id : null;
        const itemVariationId =
          value && value.row.variation_id ? value.row.variation_id : null;
        const qty = value.row.quantity;
        const avl_qty = value.row.avl_quantity;

        const handleFileInputChangeForRow = (e) => {
          handleFileInputChange(e.target, itemId, itemVariationId);
        };

        const onDrop = (event) => {
          event.preventDefault();
          handleFileInputChange(event.dataTransfer, itemId, itemVariationId);
        };

        const handlePaste = (e) => {
          e.preventDefault();
          const items = e.clipboardData.items;

          for (let item of items) {
            if (item.kind === "file") {
              const file = item.getAsFile();
              requestAnimationFrame(() => {
                handleFileInputChange(
                  { files: [file] },
                  itemId,
                  itemVariationId
                );
              });
              break; 
            }
          }
        };

        if (value && value.row.dispatch_image) {
          const isDisabled = orderDetails.order_process !== "started";
          return (
            <Row className={`${"justify-content-center"} h-100`}>
              <Col
                md={12}
                className={`d-flex align-items-center justify-content-center my-1`}
              >
                <Box className="h-100 w-100 d-flex align-items-center justify-content-center position-relative">
                  <Avatar
                    src={value.row.dispatch_image}
                    alt="Product Image"
                    sx={{
                      height: "45px",
                      width: "45px",
                      borderRadius: "2px",
                      margin: "0 auto",
                      "& .MuiAvatar-img": {
                        height: "100%",
                        width: "100%",
                        borderRadius: "2px",
                      },
                    }}
                    onClick={() => {
                      ImageModule(value.row.dispatch_image);
                      setAttachmentZoom(true);
                    }}
                  />
                  {userData?.user_id == orderDetails?.operation_user_id &&
                    orderProcess == "started" && (
                      <CancelIcon
                        sx={{
                          position: "relative",
                          top: "-30px",
                          right: "8px",
                          cursor: "pointer",
                          color: "red",
                          zIndex: 1,
                          opacity: isDisabled ? 0.5 : 1,
                          pointerEvents: isDisabled ? "none" : "auto",
                          cursor: isDisabled ? "not-allowed" : "pointer",
                        }}
                        onClick={(e) => {
                          if (!isDisabled) {
                            handleCancelImg(value.row);
                          }
                        }}
                      />
                    )}
                </Box>
              </Col>
            </Row>
          );
        } else {
          return (
            <Row className={`${"justify-content-center"} h-100`}>
              <Col
                md={12}
                className={`d-flex align-items-center justify-content-center`}
              >
                <Card className="factory-card shadow-sm mb-0">
                  {userData?.user_id == orderDetails?.operation_user_id &&
                  orderProcess == "started" &&
                  qty == avl_qty ? (
                    <Box
                      {...getRootProps()}
                      ref={dropzoneRef}
                      sx={{
                        width: "100%",
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#e0e0e0",
                        transition: "background-color 0.3s",
                        border: "2px dotted #6c757d",
                        borderRadius: "2px",
                      }}
                      className="dropzone mx-auto"
                      onDrop={onDrop}
                      onDragOver={(e) => e.preventDefault()}
                      onPaste={handlePaste}
                    >
                      <Box
                        className="d-flex flex-column justify-content-center align-items-center"
                        sx={{
                          height: "70px",
                          width: "170px",
                          lineHeight: "normal",
                        }}
                      >
                        <Box>
                          Drag & drop image
                          <input
                            type="file"
                            ref={fileInputRef}
                            {...getInputProps}
                            style={{ display: "none" }}
                          />
                        </Box>
                        <Box>OR</Box>
                        <Box className="d-flex justify-content-between">
                          <Box sx={{ mr: 2 }}>
                            <Button
                              onClick={() =>
                                fileInputRef.current[
                                  selectedVariationId
                                    ? selectedVariationId
                                    : itemId
                                ]?.click()
                              }
                              style={{ backgroundColor: "cornflowerblue" }}
                              className="buttonStyle"
                            >
                              <CloudUploadIcon />
                              <input
                                type="file"
                                ref={(input) => {
                                  if (!fileInputRef.current) {
                                    fileInputRef.current = {};
                                  }
                                  fileInputRef.current[
                                    selectedVariationId
                                      ? selectedVariationId
                                      : itemId
                                  ] = input;
                                }}
                                style={{ display: "none" }}
                                onChange={handleFileInputChangeForRow}
                              />
                            </Button>
                          </Box>
                          <Box>
                            <Button
                              onClick={() => {
                                setSelectedFileUrl(null);
                                setShowAttachModal(true);
                                setSelectedItemId(itemId);
                                setSelectedVariationId(itemVariationId);
                                setUploadImageModalOpen(false);
                              }}
                              style={{ backgroundColor: "cornflowerblue" }}
                              className="buttonStyle"
                            >
                              <CameraAltIcon />
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  ) : (
                    <Box
                      {...getRootProps({
                        onClick: (e) => e.preventDefault(),
                        onDrop: (e) => e.preventDefault(),
                      })}
                      sx={{
                        width: "100%",
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#e0e0e0",
                        transition: "background-color 0.3s",
                        border: "2px dotted #6c757d",
                        borderRadius: "2px",
                        cursor: "not-allowed",
                        pointerEvents: "none",
                      }}
                      className="dropzone mx-auto"
                    >
                      <Box
                        className="d-flex flex-column justify-content-center align-items-center"
                        sx={{
                          height: "70px",
                          width: "170px",
                          lineHeight: "normal",
                        }}
                      >
                        <Box>
                          Drag & drop image
                          <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: "none" }}
                            onChange={(e) => handleFileInputChange(e)}
                            disabled
                          />
                        </Box>
                        <Box>OR</Box>
                        <Box className="d-flex justify-content-between">
                          <Box sx={{ mr: 2 }}>
                            <Button
                              onClick={() => fileInputRef.current.click()}
                              style={{ backgroundColor: "cornflowerblue" }}
                              className="buttonStyle"
                              disabled
                            >
                              <CloudUploadIcon />
                            </Button>
                            <input
                              type="file"
                              ref={fileInputRef}
                              style={{ display: "none" }}
                              onChange={(e) => handleFileInputChange(e)}
                              disabled
                            />
                          </Box>
                          <Box>
                            <Button
                              onClick={() => {
                                setShowAttachModal(true);
                                setSelectedItemId(itemId);
                                setSelectedVariationId(itemVariationId);
                                setUploadImageModalOpen(false);
                              }}
                              style={{ backgroundColor: "cornflowerblue" }}
                              className="buttonStyle"
                              disabled
                            >
                              <CameraAltIcon />
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Card>
              </Col>
            </Row>
          );
        }
      },
    },
  ];

  const csItemBaseColumns = [
    {
      field: "item_id",
      headerName: "Item Id",
      className: "order-details",
      flex: 0.5,
    },
    {
      field: "product_name",
      headerName: "Name",
      className: "order-details",
      flex: 1.5,
      renderCell: (params) => {
        const nameToShow =
          params.row.product_eng_name || params.row.product_name;
        return nameToShow || "N/A";
      },
    },
    {
      field: "variation_id",
      headerName: "Variant Details",
      className: "order-details",
      flex: 1,
      renderCell: (params) =>
        params.row.variation_id != null && params.row.variation_id !== ""
          ? `Variation ID: ${params.row.variation_id}`
          : "—",
    },
    {
      field: "price",
      headerName: "Price",
      className: "order-details",
      flex: 0.7,
      renderCell: (params) => formatExchangeMoney(params.row.price),
    },
    {
      field: "product_image",
      headerName: "Image",
      flex: 1,
      className: "order-details",
      renderCell: (params) => (
        <Box
          className="h-100 w-100 d-flex align-items-center"
          onClick={() => {
            ImageModule(params?.row?.product_image);
            setAttachmentZoom(false);
          }}
        >
          <Avatar
            src={
              params.row.product_image || require("../../assets/default.png")
            }
            alt={params.row.product_name || ""}
            sx={{
              height: "45px",
              width: "45px",
              borderRadius: "2px",
              margin: "0 auto",
              "& .MuiAvatar-img": {
                height: "100%",
                width: "100%",
                borderRadius: "2px",
              },
            }}
          />
        </Box>
      ),
    },
    {
      field: "quantity",
      headerName: "QTY",
      flex: 0.5,
      className: "order-details",
    },
  ];

  const csExchangeItemColumns = [
    {
      field: "exc_item_id",
      headerName: "Item Id",
      className: "order-details",
      flex: 0.5,
    },
    {
      field: "exc_item_name",
      headerName: "Name",
      className: "order-details",
      flex: 1.5,
      renderCell: (params) => params.row.exc_item_name || "—",
    },
    {
      field: "exc_variation",
      headerName: "Variant Details",
      className: "order-details",
      flex: 1,
      renderCell: (params) => {
        const v = params.row.exc_variation;
        return v != null && String(v).trim() !== ""
          ? `Variation ID: ${v}`
          : "—";
      },
    },
    {
      field: "exc_amount",
      headerName: "Price",
      className: "order-details",
      flex: 0.75,
      renderCell: (params) => formatExchangeMoney(params.row.exc_amount),
    },
    {
      field: "exc_image",
      headerName: "Image",
      flex: 1,
      className: "order-details",
      renderCell: (params) => (
        <Box
          className="h-100 w-100 d-flex align-items-center"
          onClick={() => {
            ImageModule(params?.row?.exc_image);
            setAttachmentZoom(false);
          }}
        >
          <Avatar
            src={
              params.row.exc_image || require("../../assets/default.png")
            }
            alt={params.row.exc_item_name || ""}
            sx={{
              height: "45px",
              width: "45px",
              borderRadius: "2px",
              margin: "0 auto",
              "& .MuiAvatar-img": {
                height: "100%",
                width: "100%",
                borderRadius: "2px",
              },
            }}
          />
        </Box>
      ),
    },
    {
      field: "exc_quantity",
      headerName: "QTY",
      flex: 0.5,
      className: "order-details",
      renderCell: (params) =>
        params.row.exc_quantity != null && String(params.row.exc_quantity).trim() !== ""
          ? params.row.exc_quantity
          : "—",
    },
  ];

  const csItemColumns = [
    ...(csItemsTableRows.length > 1 &&
    !isAccountCsView &&
    !isCsCompletedView
      ? [
          {
            field: "cs_select",
            headerName: "Select order",
            flex: 0.45,
            minWidth: 120,
            sortable: false,
            className: "order-details",
            renderCell: (params) => (
              <Checkbox
                checked={csSelectedLineRowId === params.row.id}
                onChange={() => {
                  setCsSelectedLineRowId((prev) =>
                    prev === params.row.id ? null : params.row.id
                  );
                }}
                size="small"
                inputProps={{ "aria-label": "Select order line" }}
              />
            ),
          },
        ]
      : []),
    ...csItemBaseColumns,
  ];

  const getSelectedCsRow = () => {
    if (!csItemsTableRows.length) return null;
    if (csItemsTableRows.length > 1) {
      return csItemsTableRows.find((r) => r.id === csSelectedLineRowId) || null;
    }
    return csItemsTableRows[0];
  };

  const finishExOrderModalRow = useMemo(() => {
    if (!csItemsTableRows.length) return null;
    const matchRows = csItemsTableRows.filter(
      (r) =>
        String(r.pay_status ?? "").trim().toLowerCase() ===
        pendingFinishExOrderPayStatus
    );
    const selected = getSelectedCsRow();
    return selected &&
      String(selected.pay_status ?? "").trim().toLowerCase() ===
        pendingFinishExOrderPayStatus
      ? selected
      : matchRows[0] ?? null;
  }, [csItemsTableRows, csSelectedLineRowId, pendingFinishExOrderPayStatus]);

  const finishExOrderComputedTotal = useMemo(() => {
    const base = safeMoneyNumber(finishExOrderBaseAmount);
    if (base == null) return "";
    const extraRaw = String(finishExOrderExtraCharge ?? "")
      .trim()
      .replace(/,/g, "");
    if (extraRaw !== "") {
      const extra = Number(extraRaw);
      if (!Number.isFinite(extra) || extra < 0) return "";
    }
    return roundExchangeApiMoney(
      base - parseLooseMoneyAmount(finishExOrderExtraCharge)
    ).toFixed(2);
  }, [finishExOrderBaseAmount, finishExOrderExtraCharge]);

  const finishRefundComputedTotal = useMemo(() => {
    const base = safeMoneyNumber(finishRefundBaseAmount);
    if (base == null) return "";
    const extraRaw = String(finishRefundExtraCharge ?? "")
      .trim()
      .replace(/,/g, "");
    if (extraRaw !== "") {
      const extra = Number(extraRaw);
      if (!Number.isFinite(extra) || extra < 0) return "";
    }
    return roundExchangeApiMoney(
      base - parseLooseMoneyAmount(finishRefundExtraCharge)
    ).toFixed(2);
  }, [finishRefundBaseAmount, finishRefundExtraCharge]);

  const resolveCsTicketId = (row) =>
    row?.ticket_id ??
    row?.cs_ticket_id ??
    csOrderDetail?.ticket_id ??
    csOrderDetail?.cs_ticket_id;

  const handleOpenPushToAccountModal = () => {
    if (!csItemsTableRows.length) {
      ShowAlert("", "No line items to push.", "warning", true);
      return;
    }
    if (csItemsTableRows.length > 1 && csSelectedLineRowId == null) {
      ShowAlert("", "Please select an order line first.", "warning", true);
      return;
    }
    const row = getSelectedCsRow();
    const ticketId = resolveCsTicketId(row);
    if (ticketId == null || String(ticketId).trim() === "") {
      ShowAlert(
        "",
        "Missing ticket ID for this order. It may not be available from the server yet.",
        "error",
        true
      );
      return;
    }
    setShowCsPushAccountModal(true);
  };

  const handleClosePushToAccountModal = () => {
    if (csPushAccountLoading) return;
    setShowCsPushAccountModal(false);
  };

  const handlePushToAccount = async () => {
    const reason = csPushAccountReason.trim();
    const note = csPushAccountNote.trim();
    if (!reason) {
      ShowAlert("", "Reason is required.", "warning", true);
      return;
    }
    if (!note) {
      ShowAlert("", "Note is required.", "warning", true);
      return;
    }
    const row = getSelectedCsRow();
    const ticketId = resolveCsTicketId(row);
    if (ticketId == null || String(ticketId).trim() === "") {
      ShowAlert("", "Missing ticket ID for this order.", "error", true);
      return;
    }
    setCsPushAccountLoading(true);
    try {
      const orderIdNum = parseInt(String(id), 10);
      const result = await dispatch(
        isProductionCsView
          ? pushProductionCs({
              ticket_id: ticketId,
              order_id: orderIdNum,
              reason,
              note,
            })
          : pushCsToAccount({
              ticket_id: ticketId,
              order_id: orderIdNum,
              reason,
              note,
              category: csPushAccountCategory,
            })
      ).unwrap();
      setShowCsPushAccountModal(false);
      setCsPushAccountReason("");
      setCsPushAccountNote("");
      setCsPushAccountCategory("Refund");
      ShowAlert(
        "",
        result?.message ||
          (isProductionCsView
            ? "Pushed to CS successfully."
            : "Order pushed to account successfully."),
        "success",
        null,
        null,
        null,
        null,
        3000
      );
      if (isDefaultCustomerSupportView) {
        navigate("/customer_order_support");
      } else if (isProductionCsView) {
        navigate("/customer_support_production");
      } else {
        const url = `wp-json/custom-cs-orders/v1/cs-orders/?page=1&per_page=1&order_id=${encodeURIComponent(
          id
        )}`;
        await dispatch(fetchCsOrders({ apiUrl: url }));
      }
    } catch (err) {
      ShowAlert(
        "",
        typeof err === "string"
          ? err
          : isProductionCsView
          ? "Failed to push to CS."
          : "Failed to push order to account",
        "error",
        true
      );
    } finally {
      setCsPushAccountLoading(false);
    }
  };

  const handleOpenFinishRefundModal = () => {
    const row = getSelectedCsRow() ?? csItemsTableRows[0];
    const ticketRaw = resolveCsTicketId(row);
    if (ticketRaw == null || String(ticketRaw).trim() === "") {
      ShowAlert(
        "",
        "Missing ticket ID for this order. Cannot proceed refund.",
        "error",
        true
      );
      return;
    }
    const ticketNum = Number(ticketRaw);
    if (Number.isNaN(ticketNum)) {
      ShowAlert("", "Invalid ticket ID.", "error", true);
      return;
    }
    const baseRaw = safeMoneyNumber(row?.price ?? row?.final_amount);
    const extraRaw = safeMoneyNumber(row?.extra_charge);
    setFinishRefundBaseAmount(
      baseRaw != null ? roundExchangeApiMoney(baseRaw).toFixed(2) : ""
    );
    setFinishRefundExtraCharge(
      extraRaw != null ? roundExchangeApiMoney(extraRaw).toFixed(2) : "0.00"
    );
    setFinishRefundNoteInput("");
    setFinishRefundAttachment(null);
    if (finishRefundFileInputRef.current) {
      finishRefundFileInputRef.current.value = "";
    }
    setShowFinishRefundModal(true);
  };

  const handleCloseFinishRefundModal = () => {
    if (finishRefundLoading) return;
    setShowFinishRefundModal(false);
    setFinishRefundBaseAmount("");
    setFinishRefundExtraCharge("0.00");
    setFinishRefundNoteInput("");
    setFinishRefundAttachment(null);
    if (finishRefundFileInputRef.current) {
      finishRefundFileInputRef.current.value = "";
    }
  };

  const handleFinishRefundAttachmentChange = (e) => {
    const f = e.target.files?.[0];
    setFinishRefundAttachment(f || null);
  };

  const handleFinishRefundModalSubmit = async () => {
    const row = getSelectedCsRow() ?? csItemsTableRows[0];
    const ticketRaw = resolveCsTicketId(row);
    if (ticketRaw == null || String(ticketRaw).trim() === "") {
      ShowAlert("", "Missing ticket ID for this order.", "error", true);
      return;
    }
    const ticket_id = Number(ticketRaw);
    if (Number.isNaN(ticket_id)) {
      ShowAlert("", "Invalid ticket ID.", "error", true);
      return;
    }
    const order_id = parseInt(String(id), 10);
    const baseStr = String(finishRefundBaseAmount ?? "")
      .trim()
      .replace(/,/g, "");
    const baseNum = Number(baseStr);
    if (!baseStr || !Number.isFinite(baseNum)) {
      ShowAlert(
        "",
        "Missing paid amount for this refund line.",
        "warning",
        true
      );
      return;
    }
    if (baseNum < 0) {
      ShowAlert("", "Paid amount cannot be negative.", "warning", true);
      return;
    }
    const extraStr = String(finishRefundExtraCharge ?? "")
      .trim()
      .replace(/,/g, "");
    const extraNum = extraStr === "" ? 0 : Number(extraStr);
    if (extraStr !== "" && !Number.isFinite(extraNum)) {
      ShowAlert("", "Please enter a valid charges amount.", "warning", true);
      return;
    }
    if (extraNum < 0) {
      ShowAlert("", "Charges cannot be negative.", "warning", true);
      return;
    }
    if (!finishRefundAttachment) {
      ShowAlert("", "Please choose an attachment image.", "warning", true);
      return;
    }
    const note = String(finishRefundNoteInput ?? "").trim();
    if (!note) {
      ShowAlert("", "Please enter a note.", "warning", true);
      return;
    }
    const paymentRaw =
      csOrderDetail?.payment_via ??
      csOrderDetail?.payment_method ??
      csOrderDetail?.payment_gateway ??
      "";
    const payment_via =
      String(paymentRaw).trim() !== "" ? String(paymentRaw).trim() : "UPI";
    const acc_status = "completed";
    const assignName =
      getOrderStartedBy(csOrderDetail) ||
      [userData?.first_name, userData?.last_name].filter(Boolean).join(" ").trim() ||
      userData?.name ||
      "";
    const assign_user = String(assignName).trim();
    if (!assign_user) {
      ShowAlert(
        "",
        "Could not resolve assign user. Ensure the order has an assignee or your profile has a name.",
        "warning",
        true
      );
      return;
    }
    const chargesStr = roundExchangeApiMoney(extraNum).toFixed(2);
    const finalAmtStr = roundExchangeApiMoney(baseNum - extraNum).toFixed(2);
    setFinishRefundLoading(true);
    try {
      const result = await dispatch(
        proceedRefund({
          ticket_id,
          order_id,
          paid_amt: finalAmtStr,
          charges: chargesStr,
          final_amt: finalAmtStr,
          payment_via,
          acc_status,
          note,
          assign_user,
          attachment: finishRefundAttachment,
        })
      ).unwrap();
      setShowFinishRefundModal(false);
      setFinishRefundBaseAmount("");
      setFinishRefundExtraCharge("0.00");
      setFinishRefundNoteInput("");
      setFinishRefundAttachment(null);
      if (finishRefundFileInputRef.current) {
        finishRefundFileInputRef.current.value = "";
      }
      ShowAlert(
        "",
        result?.message || "Refund completed successfully.",
        "success",
        null,
        null,
        null,
        null,
        3000
      );
      const url = `wp-json/custom-account-orders/v1/account-orders/?page=1&per_page=1&order_id=${encodeURIComponent(
        id
      )}`;
      await dispatch(fetchAccountOrders({ apiUrl: url }));
    } catch (err) {
      ShowAlert(
        "",
        typeof err === "string" ? err : "Failed to finish refund.",
        "error",
        true
      );
    } finally {
      setFinishRefundLoading(false);
    }
  };

  const openFinishExOrderAttachmentModal = (expectedPayStatus) => {
    setPendingFinishExOrderPayStatus(expectedPayStatus);
    const matchRows = csItemsTableRows.filter(
      (r) =>
        String(r.pay_status ?? "").trim().toLowerCase() === expectedPayStatus
    );
    const selected = getSelectedCsRow();
    const row =
      selected &&
      String(selected.pay_status ?? "").trim().toLowerCase() === expectedPayStatus
        ? selected
        : matchRows[0] ?? null;
    const baseRaw = safeMoneyNumber(row?.final_amount);
    const extraRaw = safeMoneyNumber(row?.extra_charge);
    setFinishExOrderAttachmentFile(null);
    setFinishExOrderBaseAmount(
      baseRaw != null ? roundExchangeApiMoney(baseRaw).toFixed(2) : ""
    );
    setFinishExOrderExtraCharge(
      extraRaw != null ? roundExchangeApiMoney(extraRaw).toFixed(2) : ""
    );
    setFinishExOrderNote("");
    if (finishExOrderFileInputRef.current) {
      finishExOrderFileInputRef.current.value = "";
    }
    setShowFinishExOrderAttachmentModal(true);
  };

  const closeFinishExOrderAttachmentModal = () => {
    if (finishCollectCustomerLoading) return;
    setShowFinishExOrderAttachmentModal(false);
    setFinishExOrderAttachmentFile(null);
    setFinishExOrderBaseAmount("");
    setFinishExOrderExtraCharge("");
    setFinishExOrderNote("");
    if (finishExOrderFileInputRef.current) {
      finishExOrderFileInputRef.current.value = "";
    }
  };

  const handleFinishExOrderAttachmentFileChange = (e) => {
    const f = e.target.files?.[0];
    setFinishExOrderAttachmentFile(f || null);
  };

  const submitFinishExOrderWithAttachment = () => {
    if (!finishExOrderAttachmentFile) {
      ShowAlert("", "Please choose an image file.", "warning", true);
      return;
    }
    const baseStr = String(finishExOrderBaseAmount ?? "")
      .trim()
      .replace(/,/g, "");
    const baseNum = Number(baseStr);
    if (!baseStr || !Number.isFinite(baseNum)) {
      ShowAlert(
        "",
        "Missing final amount for this order line.",
        "warning",
        true
      );
      return;
    }
    if (baseNum < 0) {
      ShowAlert("", "Final amount cannot be negative.", "warning", true);
      return;
    }
    const extraStr = String(finishExOrderExtraCharge ?? "")
      .trim()
      .replace(/,/g, "");
    const extraNum = extraStr === "" ? 0 : Number(extraStr);
    if (extraStr !== "" && !Number.isFinite(extraNum)) {
      ShowAlert("", "Please enter a valid charges amount.", "warning", true);
      return;
    }
    if (extraNum < 0) {
      ShowAlert("", "Charges cannot be negative.", "warning", true);
      return;
    }
    const exNote = String(finishExOrderNote ?? "").trim();
    if (!exNote) {
      ShowAlert("", "Please enter a note.", "warning", true);
      return;
    }
    const chargesStr = roundExchangeApiMoney(extraNum).toFixed(2);
    const finalAmtStr = roundExchangeApiMoney(baseNum - extraNum).toFixed(2);
    runFinishExOrderByPayStatus(
      pendingFinishExOrderPayStatus,
      finishExOrderAttachmentFile,
      { paid_amt: finalAmtStr, charges: chargesStr, final_amt: finalAmtStr, note: exNote }
    );
  };

  /**
   * Dispatches `finishExOrder` (slice) → POST `custom-finish-exorder/v1/finish-ex-order`.
   * Resolves the line by `expectedPayStatus`: `collect-customer` | `pay-customer`.
   * Pass `attachmentFile` (from the Finish modal) so the API receives multipart `attachment`.
   */
  const runFinishExOrderByPayStatus = async (
    expectedPayStatus,
    attachmentFile,
    { paid_amt, charges, final_amt, note } = {}
  ) => {
    if (!csItemsTableRows.length) {
      ShowAlert("", "No line items.", "warning", true);
      return;
    }
    const matchRows = csItemsTableRows.filter(
      (r) =>
        String(r.pay_status ?? "").trim().toLowerCase() === expectedPayStatus
    );
    const selected = getSelectedCsRow();
    const row =
      selected &&
      String(selected.pay_status ?? "").trim().toLowerCase() ===
        expectedPayStatus
        ? selected
        : matchRows[0] ?? null;
    if (!row) {
      ShowAlert(
        "",
        expectedPayStatus === "pay-customer"
          ? "No pay-customer line item."
          : "No collect-customer line item.",
        "warning",
        true
      );
      return;
    }
    const ticketRaw = resolveCsTicketId(row);
    if (ticketRaw == null || String(ticketRaw).trim() === "") {
      ShowAlert("", "Missing ticket ID for this order.", "error", true);
      return;
    }
    const order_id = parseInt(String(id), 10);
    const ticket_id = Number(ticketRaw);
    if (Number.isNaN(ticket_id)) {
      ShowAlert("", "Invalid ticket ID.", "error", true);
      return;
    }
    const old_product_id = Number(row.product_id);
    const old_variation_id = Number(row.variation_id ?? 0);
    const new_product_id = Number(row.exc_item_id);
    const new_variation_id = Number(row.exc_variation ?? 0);
    const quantity = Number(row.quantity ?? 1);
    const priceRaw = row.final_amount ?? row.amount ?? 0;
    const new_price = roundExchangeApiMoney(priceRaw);
    if (
      Number.isNaN(old_product_id) ||
      Number.isNaN(new_product_id) ||
      old_product_id <= 0 ||
      new_product_id <= 0
    ) {
      ShowAlert(
        "",
        "Missing original or exchange product IDs for this line.",
        "error",
        true
      );
      return;
    }
    const attachment =
      attachmentFile instanceof File
        ? attachmentFile
        : pickFinishExOrderAttachmentFilename(row);
    if (!(attachment instanceof File) && String(attachment ?? "").trim() === "") {
      ShowAlert("", "Please add an attachment image.", "warning", true);
      return;
    }
    setFinishCollectCustomerLoading(true);
    try {
      const data = await dispatch(
        finishExOrder({
          order_id,
          ticket_id,
          old_product_id,
          old_variation_id: Number.isNaN(old_variation_id) ? 0 : old_variation_id,
          new_product_id,
          new_variation_id: Number.isNaN(new_variation_id) ? 0 : new_variation_id,
          quantity: Number.isNaN(quantity) || quantity <= 0 ? 1 : quantity,
          new_price,
          paid_amt: String(paid_amt ?? "").trim(),
          charges: String(charges ?? "").trim(),
          final_amt: String(final_amt ?? "").trim(),
          note: String(note ?? "").trim(),
          attachment,
        })
      ).unwrap();
      ShowAlert(
        "",
        typeof data?.message === "string" && data.message
          ? data.message
          : "Order finished successfully.",
        "success",
        null,
        null,
        null,
        null,
        3000
      );
      setShowFinishExOrderAttachmentModal(false);
      setFinishExOrderAttachmentFile(null);
      setFinishExOrderBaseAmount("");
      setFinishExOrderExtraCharge("");
      setFinishExOrderNote("");
      if (finishExOrderFileInputRef.current) {
        finishExOrderFileInputRef.current.value = "";
      }
      if (isAccountCsView) {
        const accountUrl = `wp-json/custom-account-orders/v1/account-orders/?page=1&per_page=1&order_id=${encodeURIComponent(
          id
        )}`;
        await dispatch(fetchAccountOrders({ apiUrl: accountUrl }));
      } else {
        const csUrl = `wp-json/custom-cs-orders/v1/cs-orders/?page=1&per_page=1&order_id=${encodeURIComponent(
          id
        )}`;
        await dispatch(fetchCsOrders({ apiUrl: csUrl }));
      }
    } catch (error) {
      const msg =
        typeof error === "string"
          ? error
          : error?.message || "Failed to finish order";
      ShowAlert("", String(msg), "error", true);
    } finally {
      setFinishCollectCustomerLoading(false);
    }
  };

  /** Default CS — Finish → attachment modal → `finishExOrder` (`collect-customer` line). */
  const handleFinishCollectCustomerDefaultCs = () =>
    openFinishExOrderAttachmentModal("collect-customer");

  /** Account CS exchange — Finish → same modal (`pay-customer` line). */
  const handleFinishAccountPayCustomerExchange = () =>
    openFinishExOrderAttachmentModal("pay-customer");

  const handleOpenAccountPayLinkModal = () => {
    setAccountPayLinkInput("");
    const row =
      !isAccountCsView || !csItemsTableRows.length
        ? null
        : csItemsTableRows.length > 1
          ? csSelectedLineRowId == null
            ? null
            : csItemsTableRows.find((r) => r.id === csSelectedLineRowId) || null
          : csItemsTableRows[0];
    const raw = row?.extra_charge;
    const init =
      raw != null &&
      raw !== "" &&
      !Number.isNaN(Number(raw))
        ? Number(raw).toFixed(2)
        : "";
    setAccountPayLinkExtraChargesInput(init);
    setShowAccountPayLinkModal(true);
  };

  const handleCloseAccountPayLinkModal = () => {
    if (accountPayLinkLoading) return;
    setShowAccountPayLinkModal(false);
    setAccountPayLinkInput("");
    setAccountPayLinkExtraChargesInput("");
  };

  const handleOpenCompletedFinalNoteModal = () => {
    const items = Array.isArray(csOrderDetail?.items)
      ? csOrderDetail.items
      : csItemsTableRows;
    setCompletedFinalNoteEntries(extractFinalNoteEntriesFromItems(items));
    setShowCompletedFinalNoteModal(true);
  };

  const handleCloseCompletedFinalNoteModal = () => {
    setShowCompletedFinalNoteModal(false);
    setCompletedFinalNoteEntries([{ user: "N/A", message: "—" }]);
  };

  const handleSubmitAccountPayLink = async () => {
    const pay_link = accountPayLinkInput.trim();
    if (!pay_link) {
      ShowAlert("", "Please enter a payment link.", "warning", true);
      return;
    }
    if (!csOrderDetail) return;
    if (csItemsTableRows.length > 1 && csSelectedLineRowId == null) {
      ShowAlert("", "Please select an order line first.", "warning", true);
      return;
    }
    const row = getSelectedCsRow() ?? csItemsTableRows[0];
    if (!row) {
      ShowAlert("", "No order line for this order.", "warning", true);
      return;
    }
    const ticketRaw = resolveCsTicketId(row);
    if (ticketRaw == null || String(ticketRaw).trim() === "") {
      ShowAlert("", "Missing ticket ID for this order.", "error", true);
      return;
    }
    const ticket_id = Number(ticketRaw);
    const order_id = parseInt(String(id), 10);
    if (Number.isNaN(ticket_id) || Number.isNaN(order_id)) {
      ShowAlert("", "Invalid ticket or order ID.", "error", true);
      return;
    }
    const ext_charges = roundExchangeApiMoney(
      parseLooseMoneyAmount(accountPayLinkExtraChargesInput)
    );
    const baseAmt = safeMoneyNumber(row.final_amount);
    const final_amt = roundExchangeApiMoney((baseAmt ?? 0) + ext_charges);
    if (!Number.isFinite(final_amt)) {
      ShowAlert("", "Invalid final amount for this order.", "warning", true);
      return;
    }
    setAccountPayLinkLoading(true);
    try {
      const result = await dispatch(
        updatePayLink({
          ticket_id,
          order_id,
          pay_link,
          final_amt,
          ext_charges,
        })
      ).unwrap();
      ShowAlert(
        "",
        result?.message || "Payment link saved.",
        "success",
        null,
        null,
        null,
        null,
        3000
      );
      setShowAccountPayLinkModal(false);
      setAccountPayLinkInput("");
      setAccountPayLinkExtraChargesInput("");
      navigate("/customer_support_account");
    } catch (err) {
      ShowAlert(
        "",
        typeof err === "string" ? err : "Failed to update payment link.",
        "error",
        true
      );
    } finally {
      setAccountPayLinkLoading(false);
    }
  };

  const handleReplaceProductAccount = () => {
    if (isAccountCsView) return;
    setReplaceModalProductId("");
    setReplaceModalVariationId("");
    setReplaceModalLink("");
    setReplaceModalPrice("");
    setReplaceModalReason("");
    setReplaceModalNote("");
    setReplaceProductSnapshot(null);
    setExchangePaymentData(null);
    setReplaceModalManualCharges("");
    setExchangeExItemLink("");
    setExchangeDoneSaved(false);
    setShowReplaceProductModal(true);
    if (isDefaultCustomerSupportView) {
      return;
    }
    dispatch(fetchAddProductCatalog())
      .unwrap()
      .catch((err) => {
        ShowAlert(
          "",
          typeof err === "string" ? err : "Failed to load products.",
          "error",
          true
        );
      });
  };

  const handleCloseReplaceProductModal = () => {
    setShowReplaceProductModal(false);
    setReplaceModalProductId("");
    setReplaceModalVariationId("");
    setReplaceModalLink("");
    setReplaceModalPrice("");
    setReplaceModalReason("");
    setReplaceModalNote("");
    setReplaceProductSnapshot(null);
    setReplaceModalManualCharges("");
  };

  /** GET `custom-ex-product/v1/add-product/?product_id=` (& `variation_id=`). */
  const fetchReplaceProductByParamsAndApply = async (pidRaw, vidRaw) => {
    const pid = String(pidRaw ?? "").trim();
    const vid = String(vidRaw ?? "").trim();
    const fromCatalog = addProductCatalog.find(
      (p) => String(p.product_id) === String(pid)
    );

    if (!pid) {
      setReplaceProductSnapshot(null);
      setReplaceModalLink("");
      setReplaceModalPrice("");
      return;
    }

    try {
      const data = await dispatch(
        fetchAddProductByParams({
          productId: pid,
          ...(vid !== "" ? { variationId: vid } : {}),
        })
      ).unwrap();
      const p = pickProductFromAddProductPayload(data) || fromCatalog;
      setReplaceProductSnapshot(p || null);
      const prod = p || fromCatalog;
      if (prod && !hasProductVariations(prod)) {
        const { price, link } = pickPriceAndLinkFromProduct(prod, "");
        setReplaceModalPrice(price);
        setReplaceModalLink(link);
      } else if (prod && hasProductVariations(prod) && vid !== "") {
        const { price, link } = pickPriceAndLinkFromProduct(prod, vid);
        setReplaceModalPrice(price);
        setReplaceModalLink(link);
      } else {
        setReplaceModalLink("");
        setReplaceModalPrice("");
      }
    } catch (err) {
      setReplaceProductSnapshot(fromCatalog || null);
      ShowAlert(
        "",
        typeof err === "string" ? err : "Failed to load product.",
        "error",
        true
      );
      if (fromCatalog && !hasProductVariations(fromCatalog)) {
        const { price, link } = pickPriceAndLinkFromProduct(fromCatalog, "");
        setReplaceModalPrice(price);
        setReplaceModalLink(link);
      } else {
        setReplaceModalPrice("");
        setReplaceModalLink("");
      }
    }
  };

  const handleReplaceModalProductChange = async (e) => {
    const pid = e.target.value;
    setReplaceModalProductId(pid);
    setReplaceModalVariationId("");
    setReplaceModalLink("");
    setReplaceModalPrice("");
    setReplaceProductSnapshot(null);
    setExchangePaymentData(null);
    setReplaceModalManualCharges("");
    setExchangeExItemLink("");
    setExchangeDoneSaved(false);
    if (!pid) return;
    await fetchReplaceProductByParamsAndApply(pid, "");
  };

  const handleManualReplaceProductIdBlur = async () => {
    const pid = String(replaceModalProductId).trim();
    setReplaceModalProductId(pid);
    setReplaceModalVariationId("");
    setExchangePaymentData(null);
    setReplaceModalManualCharges("");
    setExchangeExItemLink("");
    setExchangeDoneSaved(false);
    if (!pid) {
      setReplaceModalLink("");
      setReplaceModalPrice("");
      setReplaceProductSnapshot(null);
      return;
    }
    await fetchReplaceProductByParamsAndApply(pid, "");
  };

  const handleReplaceModalVariationChange = async (e) => {
    const vid = e.target.value;
    setReplaceModalVariationId(vid);
    setExchangePaymentData(null);
    setReplaceModalManualCharges("");
    setExchangeExItemLink("");
    setExchangeDoneSaved(false);

    if (!replaceModalProductId) {
      setReplaceModalLink("");
      setReplaceModalPrice("");
      return;
    }

    if (!vid) {
      if (
        activeReplaceProduct &&
        !hasProductVariations(activeReplaceProduct)
      ) {
        const { price, link } = pickPriceAndLinkFromProduct(
          activeReplaceProduct,
          ""
        );
        setReplaceModalPrice(price);
        setReplaceModalLink(link);
      } else {
        setReplaceModalLink("");
        setReplaceModalPrice("");
      }
      return;
    }

    await fetchReplaceProductByParamsAndApply(replaceModalProductId, vid);
  };

  const handleReplaceExchangeAdd = async () => {
    if (!csItemsTableRows.length) {
      ShowAlert("", "No order line to replace.", "warning", true);
      return;
    }
    if (csItemsTableRows.length > 1 && csSelectedLineRowId == null) {
      ShowAlert("", "Please select an order line first.", "warning", true);
      return;
    }
    const line = getSelectedCsRow() ?? csItemsTableRows[0];
    if (!line) {
      ShowAlert("", "No order line to replace.", "warning", true);
      return;
    }
    const ticketRaw = resolveCsTicketId(line);
    if (ticketRaw == null || String(ticketRaw).trim() === "") {
      ShowAlert("", "Missing ticket ID for this order.", "error", true);
      return;
    }
    const ticket_id = Number(ticketRaw);
    if (Number.isNaN(ticket_id)) {
      ShowAlert("", "Invalid ticket ID.", "error", true);
      return;
    }
    if (!replaceModalProductId) {
      ShowAlert(
        "",
        isDefaultCustomerSupportView
          ? "Enter a product ID."
          : "Select a new product.",
        "warning",
        true
      );
      return;
    }
    const priceStr = String(replaceModalPrice ?? "").trim();
    if (!priceStr) {
      ShowAlert("", "Price is required.", "warning", true);
      return;
    }
    const newPrice = parseFloat(priceStr.replace(/,/g, ""));
    if (Number.isNaN(newPrice)) {
      ShowAlert("", "Invalid price.", "warning", true);
      return;
    }
    if (
      hasProductVariations(activeReplaceProduct) &&
      !replaceModalVariationId
    ) {
      ShowAlert("", "Select a variation.", "warning", true);
      return;
    }

    const oldPid = Number(line.product_id ?? line.item_id ?? 0);
    const oldVid = Number(line.variation_id ?? 0);
    const newPid = parseInt(String(replaceModalProductId), 10);
    const newVid = hasProductVariations(activeReplaceProduct)
      ? parseInt(String(replaceModalVariationId), 10)
      : 0;

    setExchangeCalculateLoading(true);
    try {
      const payload = {
        order_id: parseInt(String(id), 10),
        ticket_id,
        old_product_id: oldPid,
        old_variation_id: oldVid,
        new_product_id: newPid,
        new_variation_id: newVid,
        new_price: newPrice,
      };
      const data = await dispatch(calculateExchange(payload)).unwrap();
      setExchangePaymentData(data);
      setReplaceModalManualCharges("");
      setExchangeExItemLink(String(replaceModalLink || "").trim());
      setExchangeDoneSaved(false);
    } catch (err) {
      ShowAlert(
        "",
        typeof err === "string" ? err : "Exchange calculation failed.",
        "error",
        true
      );
    } finally {
      setExchangeCalculateLoading(false);
    }
  };

  const handleReplaceProductModalDone = async () => {
    if (!exchangePaymentData) {
      handleCloseReplaceProductModal();
      return;
    }
    if (!isAccountCsView && !isDefaultCustomerSupportView) {
      handleCloseReplaceProductModal();
      return;
    }
    const reasonTrim = String(replaceModalReason ?? "").trim();
    const noteTrim = String(replaceModalNote ?? "").trim();
    if (isDefaultCustomerSupportView) {
      if (!reasonTrim) {
        ShowAlert("", "Reason is required.", "warning", true);
        return;
      }
      if (!noteTrim) {
        ShowAlert("", "Note is required.", "warning", true);
        return;
      }
    }
    const row = getSelectedCsRow() ?? csItemsTableRows[0];
    if (!row) {
      ShowAlert("", "No order line for this exchange.", "warning", true);
      return;
    }
    const ticketRaw = resolveCsTicketId(row);
    if (ticketRaw == null || String(ticketRaw).trim() === "") {
      ShowAlert(
        "",
        "Missing ticket ID for this order.",
        "error",
        true
      );
      return;
    }
    const ticket_id = Number(ticketRaw);
    if (Number.isNaN(ticket_id)) {
      ShowAlert("", "Invalid ticket ID.", "error", true);
      return;
    }
    const calc = exchangePaymentData;
    const order_id =
      calc.order_id != null ? Number(calc.order_id) : parseInt(String(id), 10);
    const product_id = Number(calc.old_product_id);
    const variation_id = Number(calc.old_variation_id ?? 0);
    const exc_item_id = Number(calc.new_product_id);
    const exc_variation = Number(calc.new_variation_id ?? 0);
    const qty = Number(calc.quantity ?? 1);
    const newPrice = Number(calc.new_price);
    const amountRaw =
      !Number.isNaN(newPrice) && !Number.isNaN(qty) ? newPrice * qty : 0;
    const balanceRaw =
      calc.ref_price_difference != null && calc.ref_price_difference !== ""
        ? Number(calc.ref_price_difference)
        : Number(calc.balance_amount ?? 0);
    const extraRaw =
      calc.ext_price_difference != null && calc.ext_price_difference !== ""
        ? Number(calc.ext_price_difference)
        : Number(calc.price_difference ?? 0);
    const manualChargesRaw = parseFloat(
      String(replaceModalManualCharges ?? "")
        .replace(/,/g, "")
        .trim() || "0"
    );
    if (Number.isNaN(manualChargesRaw)) {
      ShowAlert("", "Invalid charges amount.", "warning", true);
      return;
    }
    const finalRaw = getExchangeFinalAmountFromDifferences(calc);
    const finalRawNum =
      finalRaw != null && !Number.isNaN(Number(finalRaw))
        ? Number(finalRaw)
        : 0;
    const exc_item_link = String(
      exchangeExItemLink || replaceModalLink || ""
    ).trim();

    if ([order_id, product_id, exc_item_id].some((n) => Number.isNaN(n))) {
      ShowAlert(
        "",
        "Invalid exchange data. Run Add in Replace Product again.",
        "warning",
        true
      );
      return;
    }

    setUpdateExchangeDataLoading(true);
    try {
      const result = await dispatch(
        updateExchangeData({
          order_id,
          ticket_id,
          product_id,
          variation_id,
          exc_item_id,
          exc_variation,
          exc_item_link,
          amount: roundExchangeApiMoney(amountRaw),
          balance_refund_amt: roundExchangeApiMoney(balanceRaw),
          extra_charged_amt: roundExchangeApiMoney(extraRaw),
          charges: roundExchangeApiMoney(manualChargesRaw),
          final_amount: roundExchangeApiMoney(finalRawNum),
          category: "Exchange",
          module: "Account",
          status: "Pending",
          payment_via: String(calc.message || "").trim() || "—",
          reason: reasonTrim,
          note: noteTrim,
        })
      ).unwrap();

      ShowAlert(
        "",
        result?.message || "Exchange data saved.",
        "success",
        null,
        null,
        null,
        null,
        3000
      );
      setExchangeDoneSaved(true);
      handleCloseReplaceProductModal();
      if (isAccountCsView) {
        const url = `wp-json/custom-account-orders/v1/account-orders/?page=1&per_page=1&order_id=${encodeURIComponent(
          id
        )}`;
        await dispatch(fetchAccountOrders({ apiUrl: url }));
      } else {
        const url = `wp-json/custom-cs-orders/v1/cs-orders/?page=1&per_page=1&order_id=${encodeURIComponent(
          id
        )}`;
        await dispatch(fetchCsOrders({ apiUrl: url }));
      }
    } catch (err) {
      ShowAlert(
        "",
        typeof err === "string" ? err : "Failed to update exchange data.",
        "error",
        true
      );
    } finally {
      setUpdateExchangeDataLoading(false);
    }
  };

  const handleOpenPushToP2Modal = () => {
    if (!csItemsTableRows.length) {
      ShowAlert("", "No line items to push.", "warning", true);
      return;
    }
    if (csItemsTableRows.length > 1 && csSelectedLineRowId == null) {
      ShowAlert("", "Please select an order line first.", "warning", true);
      return;
    }
    const row = getSelectedCsRow();
    const ticketId = resolveCsTicketId(row);
    if (ticketId == null || String(ticketId).trim() === "") {
      ShowAlert(
        "",
        "Missing ticket ID for this order. It may not be available from the server yet.",
        "error",
        true
      );
      return;
    }
    if (isDefaultCustomerSupportView) {
      setPushToP2Category("");
      setPushToP2Reason("");
    } else if (isProductionCsView) {
      setPushToP2Category("Production");
      setPushToP2Reason("Move to production");
    }
    setShowPushToP2Modal(true);
  };

  const handleClosePushToP2Modal = () => {
    if (pushToP2Loading) return;
    setShowPushToP2Modal(false);
  };

  const handlePushToP2Submit = async () => {
    const reason = pushToP2Reason.trim();
    const note = pushToP2Note.trim();
    const category = pushToP2Category.trim();
    const prod_time =
      pushToP2ProdTimePreset === PUSH_TO_P2_PROD_TIME_CUSTOM
        ? pushToP2ProdTimeCustom.trim()
        : String(pushToP2ProdTimePreset || "").trim();
    if (!reason) {
      ShowAlert("", "Reason is required.", "warning", true);
      return;
    }
    if (!note) {
      ShowAlert("", "Note is required.", "warning", true);
      return;
    }
    if (!category) {
      ShowAlert("", "Category is required.", "warning", true);
      return;
    }
    if (!prod_time) {
      ShowAlert("", "Production time is required.", "warning", true);
      return;
    }
    const row = getSelectedCsRow();
    const ticketId = resolveCsTicketId(row);
    if (ticketId == null || String(ticketId).trim() === "") {
      ShowAlert("", "Missing ticket ID for this order.", "error", true);
      return;
    }
    const product_id = Number(row?.product_id ?? row?.item_id ?? 0);
    const variation_id = Number(row?.variation_id ?? 0);
    if (Number.isNaN(product_id) || product_id === 0) {
      ShowAlert("", "Missing product for this line.", "error", true);
      return;
    }
    setPushToP2Loading(true);
    try {
      const result = await dispatch(
        pushProToMain({
          ticket_id: ticketId,
          order_id: parseInt(String(id), 10),
          product_id,
          variation_id: Number.isNaN(variation_id) ? 0 : variation_id,
          reason,
          note,
          category,
          prod_time,
        })
      ).unwrap();
      setShowPushToP2Modal(false);
      ShowAlert(
        "",
        result?.message || "Production order updated successfully.",
        "success",
        null,
        null,
        null,
        null,
        3000
      );
      navigate(
        isProductionCsView
          ? "/customer_support_production"
          : "/customer_order_support"
      );
    } catch (err) {
      ShowAlert(
        "",
        typeof err === "string" ? err : "Failed to push to P2.",
        "error",
        true
      );
    } finally {
      setPushToP2Loading(false);
    }
  };

  const handleOpenPushToProductionModal = () => {
    if (!csItemsTableRows.length) {
      ShowAlert("", "No line items to push.", "warning", true);
      return;
    }
    if (csItemsTableRows.length > 1 && csSelectedLineRowId == null) {
      ShowAlert("", "Please select an order line first.", "warning", true);
      return;
    }
    const row = getSelectedCsRow();
    const ticketId = resolveCsTicketId(row);
    if (ticketId == null || String(ticketId).trim() === "") {
      ShowAlert(
        "",
        "Missing ticket ID for this order. It may not be available from the server yet.",
        "error",
        true
      );
      return;
    }
    setShowCsPushProductionModal(true);
  };

  const handleClosePushToProductionModal = () => {
    if (csPushProductionLoading) return;
    setShowCsPushProductionModal(false);
  };

  const handlePushToProductionSubmit = async () => {
    const reason = csPushProductionReason.trim();
    const note = csPushProductionNote.trim();
    const status = csPushProductionStatus;
    if (!reason) {
      ShowAlert("", "Reason is required.", "warning", true);
      return;
    }
    if (!note) {
      ShowAlert("", "Note is required.", "warning", true);
      return;
    }
    if (!String(status ?? "").trim()) {
      ShowAlert("", "Status is required.", "warning", true);
      return;
    }
    const row = getSelectedCsRow();
    const ticketId = resolveCsTicketId(row);
    if (ticketId == null || String(ticketId).trim() === "") {
      ShowAlert("", "Missing ticket ID for this order.", "error", true);
      return;
    }
    setCsPushProductionLoading(true);
    try {
      await axiosInstance.post(
        `wp-json/custom-cs-order-convert/v1/cs-to-production/${encodeURIComponent(
          String(ticketId)
        )}`,
        {
          order_id: parseInt(id, 10),
          reason,
          note,
          status,
        }
      );
      setShowCsPushProductionModal(false);
      setCsPushProductionReason("");
      setCsPushProductionNote("");
      setCsPushProductionStatus("No Respond");
      ShowAlert(
        "",
        "Order pushed to production successfully.",
        "success",
        null,
        null,
        null,
        null,
        3000
      );
      navigate("/customer_order_support");
    } catch (error) {
      const data = error?.response?.data;
      const msg =
        (typeof data === "string" ? data : null) ||
        data?.message ||
        error?.message ||
        "Failed to push order to production";
      ShowAlert("", String(msg), "error", true);
    } finally {
      setCsPushProductionLoading(false);
    }
  };

  if (isCsView) {
    return (
      <>
        <Container fluid className="px-5">
          <MDBRow className="my-3">
            <MDBCol
              md="5"
              className="d-flex justify-content-start align-items-center"
            >
              <Button
                variant="outline-secondary"
                className="p-1 me-2 bg-transparent text-secondary"
                onClick={() =>
                  navigate(
                    isPendingCsReadonlyView
                      ? "/customer_support_pending_orders"
                      : isAccountCsView
                      ? "/customer_support_account"
                      : isProductionCsView
                      ? "/customer_support_production"
                      : isCsCompletedView
                      ? "/customer_support_complete_orders"
                      : "/customer_order_support"
                  )
                }
              >
                <ArrowBackIcon className="me-1" />
              </Button>
            </MDBCol>
          </MDBRow>
          <Card className="p-3 mb-3">
            <Box className="d-flex align-items-center justify-content-between flex-wrap">
              <Box>
                <Typography variant="h6" className="fw-bold mb-3">
                  Order Details
                </Typography>
                {csDetailLoading ? (
                  <Loader />
                ) : (
                  <Box className="d-flex">
                    <Box>
                      <Typography className="fw-bold">Order# {id}</Typography>
                      <Typography className="" sx={{ fontSize: 14 }}>
                        <Badge bg="success">
                          {getCsOrderStatusLabel(csOrderDetail) || "—"}
                        </Badge>
                      </Typography>
                      {(csOrderDetail?.date || csOrderDetail?.order_date) && (
                        <Typography sx={{ fontSize: 13, mt: 1 }}>
                          {dayjs(
                            csOrderDetail.date || csOrderDetail.order_date
                          ).format("YYYY-MM-DD HH:mm")}
                        </Typography>
                      )}
                    </Box>
                    <Box className="ms-5">
                      <Typography className="fw-bold">
                        {getOrderStartedBy(csOrderDetail) || "Not assigned"}
                      </Typography>
                      <Typography className="" sx={{ fontSize: 14 }}>
                        <Badge bg="success">Order Started By</Badge>
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
              {!isAccountCsView && (
                <Box className="d-flex">
                  {!isCsCompletedView && (
                    <Button
                      variant="outline-secondary"
                      className="p-1 me-3 bg-transparent text-secondary"
                      onClick={() => setshowMessageModal(true)}
                    >
                      <AddCommentOutlinedIcon />
                    </Button>
                  )}
                  <Button
                    variant="outline-primary"
                    className="p-1 me-3 bg-transparent text-primary"
                    onClick={handlePrint}
                  >
                    <LocalPrintshopOutlinedIcon />
                  </Button>
                  {!isCsCompletedView && isDefaultCustomerSupportView && (
                    <Button
                      variant="success"
                      className="me-3"
                      onClick={handleStartOrderProcess}
                      disabled={
                        csDetailLoading ||
                        !isAssignedUserLoggedInForCsStart
                      }
                      title={
                        isAssignedUserLoggedInForCsStart
                          ? "Start order"
                          : "Only assigned user can start this order"
                      }
                    >
                      Start
                    </Button>
                  )}
                </Box>
              )}
            </Box>
          </Card>
          <Row className="mb-3">
            <Col sm={12} md={12}>
              <Card className="p-3 h-100">
                <Typography variant="h6" className="fw-bold mb-3">
                  Customer & Order
                </Typography>
                {csDetailLoading ? (
                  <Loader />
                ) : (
                  <>
                    <Row className="mb-2">
                      <Col md={5}>
                        <Typography
                          variant="label"
                          className="fw-semibold"
                          sx={{ fontSize: 14 }}
                        >
                          Name
                        </Typography>
                      </Col>
                      <Col md={7}>
                        <Typography
                          variant="label"
                          className="fw-semibold text-secondary"
                          sx={{ fontSize: 14 }}
                        >
                          : {csOrderDetail?.customer_name}
                        </Typography>
                      </Col>
                    </Row>
                    <Row className="mb-2">
                      <Col md={5}>
                        <Typography
                          variant="label"
                          className="fw-semibold"
                          sx={{ fontSize: 14 }}
                        >
                          Phone
                        </Typography>
                      </Col>
                      <Col md={7}>
                        <Typography
                          variant="label"
                          className="fw-semibold text-secondary"
                          sx={{ fontSize: 14 }}
                        >
                          : {csOrderDetail?.contact_no}
                        </Typography>
                      </Col>
                    </Row>
                    <Row className="mb-2">
                      <Col md={5}>
                        <Typography
                          variant="label"
                          className="fw-semibold"
                          sx={{ fontSize: 14 }}
                        >
                          Customer shipping address
                        </Typography>
                      </Col>
                      <Col md={7}>
                        <Typography
                          variant="label"
                          className="fw-semibold text-secondary"
                          sx={{ fontSize: 14 }}
                        >
                          : {csOrderDetail?.customer_shipping_address}
                        </Typography>
                      </Col>
                    </Row>
                    <Row className="mb-2">
                      <Col md={5}>
                        <Typography
                          variant="label"
                          className="fw-semibold"
                          sx={{ fontSize: 14 }}
                        >
                          Shipping country
                        </Typography>
                      </Col>
                      <Col md={7}>
                        <Typography
                          variant="label"
                          className="fw-semibold text-secondary"
                          sx={{ fontSize: 14 }}
                        >
                          :{" "}
                          {getCountryName(csOrderDetail?.shipping_country) ||
                            csOrderDetail?.shipping_country}
                        </Typography>
                      </Col>
                    </Row>
                    <Row className="mb-2">
                      <Col md={5}>
                        <Typography
                          variant="label"
                          className="fw-semibold"
                          sx={{ fontSize: 14 }}
                        >
                          Shipping method
                        </Typography>
                      </Col>
                      <Col md={7}>
                        <Typography
                          variant="label"
                          className="fw-semibold text-secondary"
                          sx={{ fontSize: 14 }}
                        >
                          : {csOrderDetail?.shipping_method}
                        </Typography>
                      </Col>
                    </Row>
                    {isAccountCsView && (
                      <Row className="mb-2">
                        <Col md={5}>
                          <Typography
                            variant="label"
                            className="fw-semibold"
                            sx={{ fontSize: 14 }}
                          >
                            Order Process
                          </Typography>
                        </Col>
                        <Col md={7}>
                          <Typography
                            variant="label"
                            className="fw-semibold text-secondary"
                            sx={{ fontSize: 14 }}
                            style={{ textTransform: "capitalize" }}
                          >
                            :{" "}
                            <Badge bg="success">
                              {getCsOrderStatusLabel(csOrderDetail) || "—"}
                            </Badge>
                          </Typography>
                        </Col>
                      </Row>
                    )}
                  </>
                )}
              </Card>
            </Col>
          </Row>
          <Card className="p-3 mb-3">
            <Typography variant="h6" className="fw-bold mb-3">
              Order Details
            </Typography>
            {csDetailLoading ? (
              <Loader />
            ) : csItemsTableRows.length ? (
              <>
                <div className="mt-2">
                  <DataTable
                    columns={csItemColumns}
                    rows={csItemsTableRows}
                    rowHeight={85}
                  />
                </div>
                {((isAccountCsView && !isAccountRefundOrder) ||
                  isDefaultCustomerSupportView) &&
                csExchangeDetailTableRows.length > 0 ? (
                  <>
                    <Typography
                      variant="h6"
                      className="fw-bold mt-4 mb-3 pt-3 border-top"
                    >
                      Exchange details
                    </Typography>
                    <div className="mt-2">
                      <DataTable
                        columns={csExchangeItemColumns}
                        rows={csExchangeDetailTableRows}
                        rowHeight={85}
                      />
                    </div>
                  </>
                ) : null}
                <Box
                  className={`d-flex ${
                    isCsCompletedView ? "justify-content-start" : "justify-content-end"
                  } align-items-center flex-wrap mt-3 pt-2 border-top`}
                >
                  <Box className="d-flex align-items-center gap-2">
                    {isPendingCsReadonlyView ? null : isAccountCsView &&
                      isAccountRefundOrder ? (
                      <>
                        <Button
                          variant="outline-primary"
                          className="fw-semibold"
                          disabled={
                            csDetailLoading ||
                            finishRefundLoading ||
                            exchangeCalculateLoading ||
                            updateExchangeDataLoading
                          }
                          onClick={handleOpenFinishRefundModal}
                        >
                          {finishRefundLoading ? "…" : "Finish Refund"}
                        </Button>
                      </>
                    ) : isAccountCsView &&
                      showAccountExchangePayCustomerFinish ? (
                      <Button
                        variant="outline-primary"
                        className="fw-semibold"
                        type="button"
                        disabled={
                          csDetailLoading ||
                          finishCollectCustomerLoading ||
                          exchangeCalculateLoading ||
                          updateExchangeDataLoading
                        }
                        onClick={handleFinishAccountPayCustomerExchange}
                      >
                        {finishCollectCustomerLoading ? "…" : "Finish"}
                      </Button>
                    ) : isAccountCsView &&
                      showAccountPushToCsCollectCustomer ? (
                      <Button
                        variant="outline-primary"
                        className="fw-semibold"
                        type="button"
                        disabled={
                          csDetailLoading ||
                          exchangeCalculateLoading ||
                          updateExchangeDataLoading ||
                          showAccountPayLinkModal ||
                          accountPayLinkLoading
                        }
                        onClick={handleOpenAccountPayLinkModal}
                      >
                        Push to CS
                      </Button>
                    ) : isAccountCsView ? null : isProductionCsView ? (
                      <>
                        <Button
                          variant="outline-primary"
                          className="fw-semibold"
                          disabled={
                            csPushAccountLoading ||
                            csPushProductionLoading ||
                            csDetailLoading ||
                            pushToP2Loading
                          }
                          onClick={handleOpenPushToAccountModal}
                        >
                          Push to CS
                        </Button>
                        <Button
                          variant="outline-primary"
                          className="fw-semibold"
                          disabled={csDetailLoading || pushToP2Loading}
                          onClick={handleOpenPushToP2Modal}
                        >
                          {pushToP2Loading ? "…" : "Push to P2"}
                        </Button>
                      </>
                    ) : isCsCompletedView ? (
                      <Button
                        variant="outline-primary"
                        className="fw-semibold"
                        type="button"
                        disabled={csDetailLoading}
                        onClick={handleOpenCompletedFinalNoteModal}
                      >
                        View Note
                      </Button>
                    ) : csDefaultSupportCollectCustomer ? (
                      <Button
                        variant="outline-primary"
                        className="fw-semibold"
                        disabled={
                          finishCollectCustomerLoading ||
                          csPushAccountLoading ||
                          csPushProductionLoading ||
                          csDetailLoading
                        }
                        onClick={handleFinishCollectCustomerDefaultCs}
                      >
                        {finishCollectCustomerLoading ? "…" : "Finish"}
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outline-primary"
                          className="fw-semibold me-2"
                          disabled={
                            csPushAccountLoading ||
                            csPushProductionLoading ||
                            csDetailLoading ||
                            pushToP2Loading
                          }
                          onClick={() => setshowMessageModal(true)}
                        >
                          Add Note
                        </Button>
                        <Button
                          variant="outline-primary"
                          className="fw-semibold"
                          disabled={
                            csPushAccountLoading ||
                            csPushProductionLoading ||
                            csDetailLoading ||
                            pushToP2Loading
                          }
                          onClick={handleOpenPushToAccountModal}
                        >
                          Push to Account
                        </Button>
                        <Button
                          variant="outline-primary"
                          className="fw-semibold"
                          disabled={
                            csPushAccountLoading ||
                            csPushProductionLoading ||
                            csDetailLoading ||
                            pushToP2Loading
                          }
                          onClick={handleOpenPushToProductionModal}
                        >
                          Push to Production
                        </Button>
                        <Button
                          variant="outline-primary"
                          className="fw-semibold"
                          disabled={
                            csPushAccountLoading ||
                            csPushProductionLoading ||
                            csDetailLoading ||
                            pushToP2Loading
                          }
                          onClick={handleOpenPushToP2Modal}
                        >
                          {pushToP2Loading ? "…" : "Push to P2"}
                        </Button>
                      </>
                    )}
                  </Box>
                </Box>
              </>
            ) : (
              <Alert severity="warning" sx={{ fontFamily: "monospace" }}>
                {!csOrderDetail
                  ? "No order data returned for this ID."
                  : "No line items for this order."}
              </Alert>
            )}
          </Card>
        </Container>
        <GlobalStyles
          styles={{
            ".modal-dialog.replace-product-modal-wide": {
              maxWidth: "min(88vw, 1100px)",
              width: "88vw",
            },
          }}
        />
        <Modal
          show={showReplaceProductModal && !isAccountCsView}
          onHide={() => {
            if (updateExchangeDataLoading) return;
            handleCloseReplaceProductModal();
          }}
          backdrop={updateExchangeDataLoading ? "static" : true}
          keyboard={!updateExchangeDataLoading}
          centered
          size="xl"
          scrollable
          dialogClassName="replace-product-modal-wide"
        >
          <Modal.Header closeButton>
            <Modal.Title>Replace product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {addProductCatalogLoading && !isDefaultCustomerSupportView ? (
              <Box className="d-flex justify-content-center py-5">
                <Loader />
              </Box>
            ) : (
              <>
            <Typography variant="subtitle1" className="fw-semibold mb-2">
              Products
            </Typography>
            <Table
              responsive
              bordered
              hover
              size="sm"
              className="mb-4"
              style={{ tableLayout: "fixed", width: "100%" }}
            >
              <thead className="table-light">
                <tr>
                  <th style={{ width: "20%", maxWidth: 220 }}>
                    {isDefaultCustomerSupportView ? "Product ID" : "Product name"}
                  </th>
                  <th style={{ width: "18%", maxWidth: 200 }}>
                    {isDefaultCustomerSupportView
                      ? "Variation ID"
                      : "Variation"}
                  </th>
                  <th style={{ width: "34%" }}>Product link</th>
                  <th style={{ width: "12%", maxWidth: 110 }}>Price</th>
                  <th style={{ width: "10%", maxWidth: 96 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    style={{
                      width: "20%",
                      maxWidth: 220,
                      verticalAlign: "middle",
                    }}
                  >
                    {isDefaultCustomerSupportView ? (
                      <Form.Control
                        type="text"
                        inputMode="numeric"
                        size="sm"
                        placeholder="Enter product ID"
                        value={replaceModalProductId}
                        onChange={(e) =>
                          setReplaceModalProductId(e.target.value)
                        }
                        onBlur={handleManualReplaceProductIdBlur}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            e.currentTarget.blur();
                          }
                        }}
                        disabled={
                          addProductCatalogLoading || addProductSelectionLoading
                        }
                      />
                    ) : (
                      <Form.Select
                        size="sm"
                        style={{ maxWidth: "100%" }}
                        value={replaceModalProductId}
                        onChange={handleReplaceModalProductChange}
                        disabled={
                          addProductCatalogLoading || addProductSelectionLoading
                        }
                      >
                        <option value="">Select product</option>
                        {addProductCatalog.map((p) => (
                          <option
                            key={String(p.product_id)}
                            value={String(p.product_id)}
                          >
                            {p.product_name || `Product ${p.product_id}`}
                          </option>
                        ))}
                      </Form.Select>
                    )}
                  </td>
                  <td
                    style={{
                      width: "18%",
                      maxWidth: 200,
                      verticalAlign: "middle",
                    }}
                  >
                    <Form.Select
                      size="sm"
                      style={{ maxWidth: "100%" }}
                      value={replaceModalVariationId}
                      onChange={handleReplaceModalVariationChange}
                      disabled={
                        !String(replaceModalProductId ?? "").trim() ||
                        addProductCatalogLoading ||
                        addProductSelectionLoading ||
                        !hasProductVariations(activeReplaceProduct) ||
                        replaceVariationOptions.length === 0
                      }
                    >
                      <option value="">
                        {!String(replaceModalProductId ?? "").trim()
                          ? isDefaultCustomerSupportView
                            ? "Enter product ID first"
                            : "Select product first"
                          : !hasProductVariations(activeReplaceProduct) ||
                            replaceVariationOptions.length === 0
                          ? "No variations"
                          : "Select variation"}
                      </option>
                      {replaceVariationOptions.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.label}
                        </option>
                      ))}
                    </Form.Select>
                  </td>
                  <td
                    style={{
                      width: "34%",
                      wordBreak: "break-all",
                      verticalAlign: "middle",
                    }}
                  >
                    {replaceModalLink ? (
                      <a
                        href={replaceModalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="small"
                      >
                        {replaceModalLink}
                      </a>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td
                    style={{
                      width: "12%",
                      maxWidth: 110,
                      verticalAlign: "middle",
                    }}
                  >
                    {replaceModalPrice ? (
                      replaceModalPrice
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td
                    style={{
                      width: "10%",
                      maxWidth: 96,
                      verticalAlign: "middle",
                    }}
                  >
                    <Button
                      variant="outline-primary"
                      size="sm"
                      type="button"
                      disabled={
                        exchangeCalculateLoading ||
                        addProductSelectionLoading ||
                        addProductCatalogLoading
                      }
                      onClick={handleReplaceExchangeAdd}
                    >
                      {exchangeCalculateLoading ? "…" : "Add"}
                    </Button>
                  </td>
                </tr>
              </tbody>
            </Table>
            <Typography variant="subtitle1" className="fw-semibold mb-2">
              Payment
            </Typography>
            <Table responsive bordered hover size="sm">
              <thead className="table-light">
                <tr>
                  <th>Amount</th>
                  <th>Balance refund amount</th>
                  <th>Extra charged amount</th>
                  <th>Charges</th>
                  <th>Final amount</th>
                </tr>
              </thead>
              <tbody>
                {exchangePaymentData ? (
                  <tr>
                    <td>
                      {formatExchangeMoney(
                        exchangePaymentData.new_price != null &&
                          exchangePaymentData.quantity != null
                          ? Number(exchangePaymentData.new_price) *
                              Number(exchangePaymentData.quantity)
                          : null
                      )}
                    </td>
                    <td>
                      {formatExchangeMoney(
                        exchangePaymentData.ref_price_difference != null &&
                          exchangePaymentData.ref_price_difference !== ""
                          ? exchangePaymentData.ref_price_difference
                          : exchangePaymentData.balance_amount
                      )}
                    </td>
                    <td>
                      {formatExchangeMoney(
                        exchangePaymentData.ext_price_difference != null &&
                          exchangePaymentData.ext_price_difference !== ""
                          ? exchangePaymentData.ext_price_difference
                          : exchangePaymentData.price_difference
                      )}
                    </td>
                    <td>
                      <Form.Control
                        size="sm"
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={replaceModalManualCharges}
                        onChange={(e) =>
                          setReplaceModalManualCharges(e.target.value)
                        }
                        disabled={
                          exchangeCalculateLoading || updateExchangeDataLoading
                        }
                      />
                    </td>
                    <td>
                      {formatExchangeMoney(
                        getExchangeFinalAmountFromDifferences(
                          exchangePaymentData
                        )
                      )}
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center text-muted py-3">
                      No data yet
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
            <Typography variant="subtitle1" className="fw-semibold mb-2 mt-3">
              Reason and note
            </Typography>
            <Row className="g-3 align-items-start">
              <Col xs={12} md={6}>
                <Form.Group className="mb-0">
                  <Form.Label className="fw-semibold">Reason</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter reason"
                    value={replaceModalReason}
                    onChange={(e) => setReplaceModalReason(e.target.value)}
                    disabled={
                      updateExchangeDataLoading || exchangeCalculateLoading
                    }
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group className="mb-0">
                  <Form.Label className="fw-semibold">Note</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter note"
                    value={replaceModalNote}
                    onChange={(e) => setReplaceModalNote(e.target.value)}
                    disabled={
                      updateExchangeDataLoading || exchangeCalculateLoading
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-secondary"
              disabled={
                updateExchangeDataLoading || exchangeCalculateLoading
              }
              onClick={handleReplaceProductModalDone}
            >
              {updateExchangeDataLoading
                ? "…"
                : isDefaultCustomerSupportView
                ? "Push to Account"
                : "Done"}
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={showAccountPayLinkModal}
          onHide={handleCloseAccountPayLinkModal}
          centered
          backdrop={accountPayLinkLoading ? "static" : true}
          keyboard={!accountPayLinkLoading}
        >
          <Modal.Header closeButton={!accountPayLinkLoading}>
            <Modal.Title>Push to CS</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Payment link</Form.Label>
              <Form.Control
                type="url"
                placeholder="https://..."
                value={accountPayLinkInput}
                onChange={(e) => setAccountPayLinkInput(e.target.value)}
                disabled={accountPayLinkLoading}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSubmitAccountPayLink();
                  }
                }}
              />
            </Form.Group>
            <Row className="g-3">
              <Col xs={12}>
                <Form.Group className="mb-0">
                  <Form.Label className="fw-semibold">Extra charges</Form.Label>
                  <Form.Control
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={accountPayLinkExtraChargesInput}
                    onChange={(e) =>
                      setAccountPayLinkExtraChargesInput(e.target.value)
                    }
                    disabled={accountPayLinkLoading}
                  />
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group className="mb-0">
                  <Form.Label className="fw-semibold">Final amount</Form.Label>
                  <Form.Control
                    type="text"
                    value={accountPayLinkFinalAmountText}
                    readOnly
                    disabled={accountPayLinkLoading}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-secondary"
              onClick={handleCloseAccountPayLinkModal}
              disabled={accountPayLinkLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmitAccountPayLink}
              disabled={accountPayLinkLoading}
            >
              {accountPayLinkLoading ? "…" : "Done"}
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={showCompletedFinalNoteModal}
          onHide={handleCloseCompletedFinalNoteModal}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Order Note</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-0">
              <Form.Label className="fw-semibold">Note</Form.Label>
              <Box
                sx={{
                  border: "1px solid #dee2e6",
                  borderRadius: "6px",
                  padding: "10px 12px",
                  maxHeight: 260,
                  overflowY: "auto",
                }}
              >
                {completedFinalNoteEntries.map((entry, idx) => (
                  <Box
                    key={`completed-note-entry-${idx}`}
                    sx={{
                      mb: idx === completedFinalNoteEntries.length - 1 ? 0 : 1.5,
                      pb: idx === completedFinalNoteEntries.length - 1 ? 0 : 1.5,
                      borderBottom:
                        idx === completedFinalNoteEntries.length - 1
                          ? "none"
                          : "1px solid #f0f0f0",
                    }}
                  >
                    <Typography variant="body2" className="mb-1">
                      <strong>User name:</strong> {entry.user || "N/A"}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Note:</strong> {entry.message || "—"}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Form.Group>
          </Modal.Body>
        </Modal>
        <Modal
          show={showFinishExOrderAttachmentModal}
          onHide={closeFinishExOrderAttachmentModal}
          centered
          backdrop={finishCollectCustomerLoading ? "static" : true}
          keyboard={!finishCollectCustomerLoading}
        >
          <Modal.Header closeButton={!finishCollectCustomerLoading}>
            <Modal.Title>Finish order</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                Final amount <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                inputMode="decimal"
                value={finishExOrderBaseAmount}
                readOnly
                disabled={finishCollectCustomerLoading}
                autoComplete="off"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                Charges <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                inputMode="decimal"
                placeholder="e.g. 100.00"
                value={finishExOrderExtraCharge}
                onChange={(e) => setFinishExOrderExtraCharge(e.target.value)}
                disabled={finishCollectCustomerLoading}
                autoComplete="off"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                Total amount <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                inputMode="decimal"
                value={finishExOrderComputedTotal}
                readOnly
                disabled={finishCollectCustomerLoading}
                autoComplete="off"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                Note <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="e.g. Exchange completed"
                value={finishExOrderNote}
                onChange={(e) => setFinishExOrderNote(e.target.value)}
                disabled={finishCollectCustomerLoading}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label className="fw-semibold">Attachment</Form.Label>
              <Form.Control
                ref={finishExOrderFileInputRef}
                type="file"
                accept="image/*"
                disabled={finishCollectCustomerLoading}
                onChange={handleFinishExOrderAttachmentFileChange}
              />
            </Form.Group>
            {finishExOrderAttachmentFile ? (
              <Box className="mt-2">
                <Typography variant="caption" className="text-muted d-block mb-1">
                  {finishExOrderAttachmentFile.name}
                </Typography>
                {finishExOrderAttachmentPreviewUrl ? (
                  <Box
                    component="img"
                    src={finishExOrderAttachmentPreviewUrl}
                    alt="Attachment preview"
                    sx={{
                      maxWidth: "100%",
                      maxHeight: 220,
                      objectFit: "contain",
                      borderRadius: 1,
                      border: "1px solid #e0e0e0",
                    }}
                  />
                ) : null}
              </Box>
            ) : null}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-secondary"
              onClick={closeFinishExOrderAttachmentModal}
              disabled={finishCollectCustomerLoading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={submitFinishExOrderWithAttachment}
              disabled={
                finishCollectCustomerLoading ||
                !finishExOrderModalRow ||
                !finishExOrderAttachmentFile ||
                !String(finishExOrderNote ?? "").trim() ||
                (() => {
                  const base = String(finishExOrderBaseAmount ?? "")
                    .trim()
                    .replace(/,/g, "");
                  if (!base) return true;
                  const baseNum = Number(base);
                  if (!Number.isFinite(baseNum) || baseNum < 0) return true;
                  const extra = String(finishExOrderExtraCharge ?? "")
                    .trim()
                    .replace(/,/g, "");
                  if (!extra) return false;
                  const extraNum = Number(extra);
                  return !Number.isFinite(extraNum) || extraNum < 0;
                })()
              }
            >
              {finishCollectCustomerLoading ? "…" : "Finish order"}
            </Button>
          </Modal.Footer>
        </Modal>
        {isAccountCsView && (
          <Modal
            show={showFinishRefundModal}
            onHide={handleCloseFinishRefundModal}
            centered
            backdrop={finishRefundLoading ? "static" : true}
            keyboard={!finishRefundLoading}
          >
            <Modal.Header closeButton={!finishRefundLoading}>
              <Modal.Title>Finish refund</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Paid amount</Form.Label>
                <Form.Control
                  type="text"
                  inputMode="decimal"
                  value={finishRefundBaseAmount}
                  readOnly
                  disabled={finishRefundLoading}
                  autoComplete="off"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Charges</Form.Label>
                <Form.Control
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={finishRefundExtraCharge}
                  onChange={(e) => setFinishRefundExtraCharge(e.target.value)}
                  disabled={finishRefundLoading}
                  autoComplete="off"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Final amount</Form.Label>
                <Form.Control
                  type="text"
                  inputMode="decimal"
                  value={finishRefundComputedTotal}
                  readOnly
                  disabled={finishRefundLoading}
                  autoComplete="off"
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label className="fw-semibold">Attachment</Form.Label>
                <Form.Control
                  ref={finishRefundFileInputRef}
                  type="file"
                  accept="image/*"
                  disabled={finishRefundLoading}
                  onChange={handleFinishRefundAttachmentChange}
                />
              </Form.Group>
              {finishRefundAttachment ? (
                <Box className="mt-2">
                  <Typography variant="caption" className="text-muted d-block mb-1">
                    {finishRefundAttachment.name}
                  </Typography>
                  {finishRefundAttachmentPreviewUrl ? (
                    <Box
                      component="img"
                      src={finishRefundAttachmentPreviewUrl}
                      alt="Refund attachment preview"
                      sx={{
                        maxWidth: "100%",
                        maxHeight: 220,
                        objectFit: "contain",
                        borderRadius: 1,
                        border: "1px solid #e0e0e0",
                      }}
                    />
                  ) : null}
                </Box>
              ) : null}
              <Form.Group className="mb-0 mt-3">
                <Form.Label className="fw-semibold">
                  Note <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter a note for this refund"
                  value={finishRefundNoteInput}
                  onChange={(e) => setFinishRefundNoteInput(e.target.value)}
                  disabled={finishRefundLoading}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="outline-secondary"
                onClick={handleCloseFinishRefundModal}
                disabled={finishRefundLoading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleFinishRefundModalSubmit}
                disabled={
                  finishRefundLoading ||
                  (() => {
                    const base = String(finishRefundBaseAmount ?? "")
                      .trim()
                      .replace(/,/g, "");
                    if (!base) return true;
                    const baseNum = Number(base);
                    if (!Number.isFinite(baseNum) || baseNum < 0) return true;
                    const extra = String(finishRefundExtraCharge ?? "")
                      .trim()
                      .replace(/,/g, "");
                    if (!extra) return false;
                    const extraNum = Number(extra);
                    return !Number.isFinite(extraNum) || extraNum < 0;
                  })() ||
                  !String(finishRefundNoteInput ?? "").trim()
                }
              >
                {finishRefundLoading ? "…" : "Finish Refund"}
              </Button>
            </Modal.Footer>
          </Modal>
        )}
        {!isAccountCsView && (
          <Modal
            show={showCsPushAccountModal}
            onHide={handleClosePushToAccountModal}
            centered
          >
            <Modal.Header closeButton={!csPushAccountLoading}>
              <Modal.Title>
                {isProductionCsView ? "Push to CS" : "Push to Account"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {!isProductionCsView && (
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Category</Form.Label>
                  <Form.Select
                    value={csPushAccountCategory}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (
                        isDefaultCustomerSupportView &&
                        v === "Exchange"
                      ) {
                        setShowCsPushAccountModal(false);
                        setCsPushAccountCategory("Refund");
                        handleReplaceProductAccount();
                        return;
                      }
                      setCsPushAccountCategory(v);
                    }}
                    disabled={csPushAccountLoading}
                  >
                    <option value="Refund">Refund</option>
                    <option value="Exchange">Exchange</option>
                  </Form.Select>
                </Form.Group>
              )}
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Reason</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter reason"
                  value={csPushAccountReason}
                  onChange={(e) => setCsPushAccountReason(e.target.value)}
                  disabled={csPushAccountLoading}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label className="fw-semibold">Note</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter note"
                  value={csPushAccountNote}
                  onChange={(e) => setCsPushAccountNote(e.target.value)}
                  disabled={csPushAccountLoading}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="outline-secondary"
                onClick={handleClosePushToAccountModal}
                disabled={csPushAccountLoading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handlePushToAccount}
                disabled={csPushAccountLoading}
              >
                {csPushAccountLoading
                  ? "Pushing..."
                  : isProductionCsView
                  ? "Push to CS"
                  : "Push to Account"}
              </Button>
            </Modal.Footer>
          </Modal>
        )}
        {(isProductionCsView || isDefaultCustomerSupportView) && (
          <Modal
            show={showPushToP2Modal}
            onHide={handleClosePushToP2Modal}
            centered
            backdrop={pushToP2Loading ? "static" : true}
            keyboard={!pushToP2Loading}
          >
            <Modal.Header closeButton={!pushToP2Loading}>
              <Modal.Title>Push to P2</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Category</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={
                    isDefaultCustomerSupportView
                      ? "customer support"
                      : "e.g. Production"
                  }
                  value={pushToP2Category}
                  onChange={(e) => setPushToP2Category(e.target.value)}
                  disabled={pushToP2Loading}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Reason</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={
                    isDefaultCustomerSupportView
                      ? "push to p2"
                      : "e.g. Move to production"
                  }
                  value={pushToP2Reason}
                  onChange={(e) => setPushToP2Reason(e.target.value)}
                  disabled={pushToP2Loading}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Note</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="e.g. Approved for production"
                  value={pushToP2Note}
                  onChange={(e) => setPushToP2Note(e.target.value)}
                  disabled={pushToP2Loading}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label className="fw-semibold">Production time</Form.Label>
                <Form.Select
                  value={pushToP2ProdTimePreset}
                  onChange={(e) => setPushToP2ProdTimePreset(e.target.value)}
                  disabled={pushToP2Loading}
                >
                  <option value="7/10 Days">7/10 Days</option>
                  <option value="15 Days">15 Days</option>
                  <option value="30 Days">30 Days</option>
                  <option value="40 Days">40 Days</option>
                  <option value={PUSH_TO_P2_PROD_TIME_CUSTOM}>
                    Custom (manual input)
                  </option>
                </Form.Select>
                {pushToP2ProdTimePreset === PUSH_TO_P2_PROD_TIME_CUSTOM && (
                  <Form.Control
                    type="text"
                    className="mt-2"
                    placeholder="Enter production time"
                    value={pushToP2ProdTimeCustom}
                    onChange={(e) => setPushToP2ProdTimeCustom(e.target.value)}
                    disabled={pushToP2Loading}
                  />
                )}
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="outline-secondary"
                onClick={handleClosePushToP2Modal}
                disabled={pushToP2Loading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handlePushToP2Submit}
                disabled={pushToP2Loading}
              >
                {pushToP2Loading ? "Pushing…" : "Push to P2"}
              </Button>
            </Modal.Footer>
          </Modal>
        )}
        {!isAccountCsView && !isProductionCsView && (
          <Modal
            show={showCsPushProductionModal}
            onHide={handleClosePushToProductionModal}
            centered
          >
            <Modal.Header closeButton={!csPushProductionLoading}>
              <Modal.Title>Push to Production</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Status</Form.Label>
                <Form.Select
                  value={csPushProductionStatus}
                  onChange={(e) => setCsPushProductionStatus(e.target.value)}
                  disabled={csPushProductionLoading}
                >
                  <option value="No Respond">No Respond</option>
                  <option value="Switch Off">Switch Off</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Reason</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="e.g. Quality verified"
                  value={csPushProductionReason}
                  onChange={(e) => setCsPushProductionReason(e.target.value)}
                  disabled={csPushProductionLoading}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label className="fw-semibold">Note</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="e.g. Ready for production"
                  value={csPushProductionNote}
                  onChange={(e) => setCsPushProductionNote(e.target.value)}
                  disabled={csPushProductionLoading}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="outline-secondary"
                onClick={handleClosePushToProductionModal}
                disabled={csPushProductionLoading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handlePushToProductionSubmit}
                disabled={csPushProductionLoading}
              >
                {csPushProductionLoading ? "Pushing..." : "Push to Production"}
              </Button>
            </Modal.Footer>
          </Modal>
        )}
        <Modal
          show={showMessageModal}
          onHide={() => setshowMessageModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {isDefaultCustomerSupportView ? "Note" : "Message"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {isDefaultCustomerSupportView ? (
              <>
                <Form.Group className="mb-2">
                  <Form.Label className="fw-semibold">Note</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter your note here..."
                    value={csNoteBody}
                    onChange={(e) => setCsNoteBody(e.target.value)}
                    disabled={csAddNoteLoading}
                  />
                </Form.Group>
                <Box className="text-end my-3">
                  <Button
                    variant="secondary"
                    className="mt-2 fw-semibold"
                    onClick={handleCsAddNoteSubmit}
                    disabled={
                      csAddNoteLoading ||
                      csDetailLoading ||
                      !csNoteBody.trim()
                    }
                  >
                    {csAddNoteLoading ? "Saving…" : "Add Note"}
                  </Button>
                </Box>
              </>
            ) : (
              <>
                <Form.Control
                  as="textarea"
                  placeholder="Enter your message here..."
                  rows={3}
                  value={message}
                  onChange={(e) => handleChange(e)}
                />
                <Box className="text-end my-3">
                  <Button
                    variant="secondary"
                    className="mt-2 fw-semibold"
                    onClick={handleAddMessage}
                  >
                    Add Message
                  </Button>
                </Box>
              </>
            )}
          </Modal.Body>
        </Modal>
      </>
    );
  }

  return (
    <>
      <Container fluid className="px-5">
        <MDBRow className="my-3">
          <MDBCol
            md="5"
            className="d-flex justify-content-start align-items-center"
          >
            <Button
              variant="outline-secondary"
              className="p-1 me-2 bg-transparent text-secondary"
              onClick={() => navigate("/ordersystem")}
            >
              <ArrowBackIcon className="me-1" />
            </Button>
            <Box></Box>
          </MDBCol>
          {orderDetails?.operation_user_id != userData?.user_id &&
            orderDetails?.order_process == "started" && (
              <MDBCol md="7" className="d-flex justify-content-end">
                <Alert variant={"danger"}>
                  This order has already been taken by another user!
                </Alert>
              </MDBCol>
            )}
        </MDBRow>
        <Card className="p-3 mb-3">
          <Box className="d-flex align-items-center justify-content-between">
            <Box>
              <Typography variant="h6" className="fw-bold mb-3">
                Order Details
              </Typography>
              {loader ? (
                <Loader />
              ) : (
                <Box className="d-flex">
                  <Box>
                    <Typography className="fw-bold">Order# {id}</Typography>
                    <Typography
                      className=""
                      sx={{
                        fontSize: 14,
                      }}
                    >
                      <Badge bg="success">{orderDetails?.order_status}</Badge>
                    </Typography>
                  </Box>
                  {orderDetails?.order_process == "started" && (
                    <Box className="ms-5">
                      <Typography className="fw-bold">
                        {orderDetails?.user_name}
                      </Typography>
                      <Typography
                        className=""
                        sx={{
                          fontSize: 14,
                        }}
                      >
                        <Badge bg="success">Order Started By</Badge>
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
            <Box className="d-flex">
              <Button
                variant="outline-secondary"
                className="p-1 me-3 bg-transparent text-secondary"
                onClick={() => setshowMessageModal(true)}
              >
                <AddCommentOutlinedIcon />
              </Button>
              <Button
                variant="outline-primary"
                className="p-1 me-3 bg-transparent text-primary"
                onClick={handlePrint}
              >
                <LocalPrintshopOutlinedIcon />
              </Button>
              <Box className="d-flex">
                <Box>
                  {userData?.user_id == orderDetails?.operation_user_id &&
                  orderProcess == "started" ? (
                    <Button
                      variant="outline-danger"
                      className="p-1 me-2 bg-transparent text-danger"
                      onClick={handleCancelOrderProcess}
                    >
                      <CancelIcon />
                    </Button>
                  ) : orderProcess == "started" &&
                    userData?.user_id != orderDetails?.operation_user_id ? (
                    <Button variant="success" disabled className="me-3">
                      Start
                    </Button>
                  ) : (
                    <Button
                      variant="success"
                      // disabled
                      onClick={handleStartOrderProcess}
                      className="me-3"
                    >
                      Start
                    </Button>
                  )}
                </Box>
                <Box>
                  <Button
                    variant="primary"
                    // disabled
                    onClick={handleSendToChinaSystem}
                  >
                    Send To China
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Card>
        <Row className="mb-3">
          <Col
            sm={12}
            md={tableData.some((data) => data.status_change === "1") ? 6 : 12}
          >
            <Card className="p-3 h-100">
              <Typography variant="h6" className="fw-bold mb-3">
                Customer & Order
              </Typography>
              {loader ? (
                <Loader />
              ) : (
                <>
                  <Row className="mb-2">
                    <Col md={5}>
                      <Typography
                        variant="label"
                        className="fw-semibold"
                        sx={{
                          fontSize: 14,
                        }}
                      >
                        Name
                      </Typography>
                    </Col>
                    <Col md={7}>
                      <Typography
                        variant="label"
                        className="fw-semibold text-secondary"
                        sx={{
                          fontSize: 14,
                        }}
                      >
                        : {"  "}
                        {orderDetails?.customer_name}
                      </Typography>
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col md={5}>
                      <Typography
                        variant="label"
                        className="fw-semibold"
                        sx={{
                          fontSize: 14,
                        }}
                      >
                        Phone
                      </Typography>
                    </Col>
                    <Col md={7}>
                      <Typography
                        variant="label"
                        className="fw-semibold text-secondary"
                        sx={{
                          fontSize: 14,
                        }}
                      >
                        : {"  "}
                        {orderDetails?.contact_no}
                      </Typography>
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col md={5}>
                      <Typography
                        variant="label"
                        className="fw-semibold"
                        sx={{
                          fontSize: 14,
                        }}
                      >
                        Customer shipping address
                      </Typography>
                    </Col>
                    <Col md={7}>
                      <Typography
                        variant="label"
                        className="fw-semibold text-secondary"
                        sx={{
                          fontSize: 14,
                        }}
                      >
                        : {"  "}
                        {orderDetails?.customer_shipping_address}
                      </Typography>
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col md={5}>
                      <Typography
                        variant="label"
                        className="fw-semibold"
                        sx={{
                          fontSize: 14,
                        }}
                      >
                        Order Process
                      </Typography>
                    </Col>
                    <Col md={7}>
                      <Typography
                        variant="label"
                        className="fw-semibold text-secondary"
                        sx={{
                          fontSize: 14,
                          textTransform: "capitalize",
                        }}
                      >
                        : {"  "}
                        <Badge bg="success">
                          {orderDetails?.order_process}
                        </Badge>
                      </Typography>
                    </Col>
                  </Row>
                </>
              )}
            </Card>
          </Col>
          {tableData.some((data) => data.status_change === "1") ? (
            <Col sm={12} md={6}>
              <Card className="p-3 h-100">
                <Typography variant="h6" className="fw-bold mb-3">
                  Attachment
                </Typography>
                {loader ? (
                  <Loader />
                ) : (
                  <>
                    <Row className={`${"justify-content-center"} h-100`}>
                      <Col
                        md={12}
                        className={`d-flex align-items-center justify-content-center my-1`}
                      >
                        {tableData.some(
                          (data) => data.dispatch_image === ""
                        ) ? (
                          <Alert
                            severity="warning"
                            sx={{ fontFamily: "monospace", fontSize: "18px" }}
                          >
                            Please upload attachment for all the products in
                            below order table!
                          </Alert>
                        ) : orderDetailsDataOrderId?.overall_order_dis_image !=
                          "" ? (
                          <Avatar
                            src={
                              orderDetailsDataOrderId?.overall_order_dis_image
                            }
                            alt="Product Image"
                            sx={{
                              height: "150px",
                              width: "100%",
                              borderRadius: "2px",
                              margin: "0 auto",
                              "& .MuiAvatar-img": {
                                height: "100%",
                                width: "100%",
                                borderRadius: "2px",
                              },
                            }}
                          />
                        ) : (
                          <>
                            <Card className="factory-card me-1 shadow-sm mb-0">
                              {userData?.user_id ==
                                orderDetailsDataOrderId?.operation_user_id &&
                              orderProcess == "started" ? (
                                <>
                                  <Button
                                    className="bg-transparent border-0 text-black"
                                    onClick={() =>
                                      setUploadImageModalOpen(true)
                                    }
                                  >
                                    <CloudUploadIcon />
                                    <Typography style={{ fontSize: "14px" }}>
                                      Device
                                    </Typography>
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  className="bg-transparent border-0 text-black"
                                  disabled
                                >
                                  <CloudUploadIcon />
                                  <Typography style={{ fontSize: "14px" }}>
                                    Device
                                  </Typography>
                                </Button>
                              )}
                            </Card>

                            <Card className="factory-card ms-1 shadow-sm mb-0">
                              {userData?.user_id ==
                                orderDetailsDataOrderId?.operation_user_id &&
                              orderProcess == "started" ? (
                                <Button
                                  className="bg-transparent border-0 text-black"
                                  onClick={() => setShowAttachModal(true)}
                                >
                                  <CameraAltIcon />
                                  <Typography style={{ fontSize: "14px" }}>
                                    Camera
                                  </Typography>
                                </Button>
                              ) : (
                                <Button
                                  className="bg-transparent border-0 text-black"
                                  disabled
                                >
                                  <CameraAltIcon />
                                  <Typography style={{ fontSize: "14px" }}>
                                    Camera
                                  </Typography>
                                </Button>
                              )}
                            </Card>
                          </>
                        )}
                      </Col>
                    </Row>
                  </>
                )}
              </Card>
            </Col>
          ) : null}
        </Row>
        <Card className="p-3 mb-3">
          <Typography variant="h6" className="fw-bold mb-3">
            Order Details
          </Typography>
          {loader ? (
            <Loader />
          ) : (
            <div className="mt-2">
              <DataTable
                columns={columns}
                rows={tableData}
                // page={page}
                // pageSize={pageSize}
                // totalPages={totalPages}
                // handleChange={handleChange}
                rowHeight={85}
              />
            </div>
          )}
        </Card>
        {orderDetailsDataOrderId?.operation_user_note &&
          orderDetailsDataOrderId?.operation_user_note.length > 0 && (
            <Card className="p-3 mb-3">
              <Box className="d-flex align-items-center justify-content-between">
                <Box className="w-100">
                  <Typography
                    variant="h6"
                    className="fw-bold mb-3"
                  ></Typography>
                  <Box className="d-flex justify-content-between">
                    <div style={{ width: "100%" }}>
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1-content"
                          id="panel1-header"
                        >
                          <Typography variant="h6" className="fw-bold">
                            Messages
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails
                          style={{ maxHeight: "200px", overflowY: "auto" }}
                        >
                          <List>
                            {orderDetailsDataOrderId?.operation_user_note.map(
                              (message, i) => (
                                <ListItem
                                  key={i}
                                  className="d-flex justify-content-start"
                                >
                                  <ListItemText
                                    primary={message.message}
                                    secondary={message.user}
                                    className="rounded p-2"
                                    style={{
                                      maxWidth: "70%",
                                      minWidth: "50px",
                                      backgroundColor: "#bfdffb",
                                    }}
                                  />
                                </ListItem>
                              )
                            )}
                          </List>
                        </AccordionDetails>
                      </Accordion>
                    </div>
                  </Box>
                </Box>
              </Box>
            </Card>
          )}
        <Alert variant={"info"}>
          <label>Customer Note :-</label> "There is a customer note!"
        </Alert>
        <MDBRow>
          <MDBCol md="12" className="d-flex justify-content-end">
            {userData?.user_id == orderDetails?.operation_user_id &&
            orderProcess == "started" &&
            tableData?.some((data) => data.dispatch_image != "") ? (
              <>
                <Button
                  variant="success"
                  className=" mx-2"
                  onClick={() => setshowMessageOHModal(true)}
                >
                  On Hold
                </Button>
                {Finished ? (
                  <Button
                    variant="danger"
                    disabled
                    onClick={handleFinishButtonClick}
                  >
                    Finish
                  </Button>
                ) : (
                  <Button variant="danger" onClick={handleFinishButtonClick}>
                    Finish
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button
                  variant="success"
                  className=" mx-2"
                  disabled={
                    orderProcess != "started" ||
                    userData?.user_id != orderDetails?.operation_user_id
                    // tableData?.some((data) => data.dispatch_image == "")
                  }
                  onClick={() => setshowMessageOHModal(true)}
                >
                  On Hold
                </Button>
                {Finished ? (
                  <Button
                    variant="danger"
                    disabled
                    onClick={handleFinishButtonClick}
                  >
                    Finish
                  </Button>
                ) : (
                  <Button
                    variant="danger"
                    disabled={
                      orderProcess != "started" ||
                      userData?.user_id != orderDetails?.operation_user_id ||
                      tableData?.some((data) => data.dispatch_image == "")
                    }
                    onClick={handleFinishButtonClick}
                  >
                    Finish
                  </Button>
                )}
              </>
            )}
          </MDBCol>
        </MDBRow>
        <Modal
          show={showAttachModal}
          onHide={() => setShowAttachModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Select Attachment From</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-3">
            <Box className="d-flex justify-content-center my-5">
              <Box className="">
                {selectedFileUrl ? (
                  <img src={selectedFileUrl} alt="webcam" />
                ) : (
                  <Webcam
                    style={{ width: "100%", height: "100%" }}
                    ref={webcamRef}
                  />
                )}
                <Box className="btn-container">
                  {selectedFileUrl ? (
                    <Button onClick={retake}>Retake photo</Button>
                  ) : (
                    <Button onClick={capture}>Capture photo</Button>
                  )}
                </Box>
              </Box>
            </Box>
          </Modal.Body>
        </Modal>
        <Modal
          show={showEditModal}
          // onHide={handleCloseEditModal}
          onHide={() => setShowEditModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {attachmentZoom ? "Attached Image" : "Product Image"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Card className="factory-card">
              <img src={imageURL} alt="Product" />
            </Card>
          </Modal.Body>
        </Modal>
        <PrintModal
          show={showModal}
          handleClosePrintModal={() => setShowModal(false)}
          showModal={showModal}
          orderData={orderData}
        />
        <Modal
          show={showMessageModal}
          onHide={() => setshowMessageModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Message</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Control
              as="textarea"
              placeholder="Enter your message here..."
              rows={3}
              value={message}
              onChange={(e) => handleChange(e)}
            />
            <Box className="text-end my-3">
              <Button
                variant="secondary"
                className="mt-2 fw-semibold"
                onClick={handleAddMessage}
              >
                Add Message
              </Button>
            </Box>
          </Modal.Body>
        </Modal>
        <Modal
          show={showMessageOHModal}
          onHide={() => setshowMessageOHModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>On Hold Reason </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Control
              as="textarea"
              placeholder="Enter your reason here..."
              rows={3}
              value={messageOH}
              onChange={(e) => setOHMessage(e.target.value)}
            />
            <Box className="text-end my-3">
              {AddInOnHold ? (
                <Button
                  variant="secondary"
                  className="mt-2 fw-semibold"
                  onClick={submitOH}
                  disabled
                >
                  Submit
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  className="mt-2 fw-semibold"
                  disabled={messageOH == "" ? true : false}
                  onClick={submitOH}
                >
                  Submit
                </Button>
              )}
            </Box>
          </Modal.Body>
        </Modal>
        <Modal
          show={showAttachmentModal}
          onHide={() => setShowAttachmentModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Attachment</Modal.Title>
          </Modal.Header>
          <Modal.Body className="py-4">
            <Row className="justify-content-center">
              <Col md={10}>
                <Box
                  className="mx-auto mb-4 border border-secondary rounded-4"
                  sx={{
                    height: "150px",
                    width: "100%",
                    position: "relative",
                  }}
                >
                  <CancelIcon
                    sx={{
                      position: "absolute",
                      top: "-9px",
                      right: "-9px",
                      cursor: "pointer",
                    }}
                    onClick={handleCancel}
                  />
                  <img
                    style={{ objectFit: "cover" }}
                    className="h-100 w-100 rounded-4"
                    alt=""
                    src={selectedFileUrl}
                  />
                </Box>
                <Box className="text-end">
                  {selectedItemId ? (
                    <Button
                      variant="primary"
                      className=""
                      onClick={handleSubmitAttachment}
                      disabled={attachmentsubmitbtn}
                    >
                      Submit
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      className=""
                      onClick={handleSubmitAttachment}
                      disabled={attachmentsubmitbtn}
                    >
                      Submitt
                    </Button>
                  )}
                </Box>
              </Col>
            </Row>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
}
export default OrderDetails;
