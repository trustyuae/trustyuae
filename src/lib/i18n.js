import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  debug: true,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  resources: {
    Zn: {
      translation: {
        POManagement: {
          title: "PO訂單管理系統",
          ChangeLanguage: "改變語言",
          DateFilter: "日期過濾器",
          FactoryFilter: "工廠過濾器",
          POStatusFilter: "採購訂單狀態篩選器",
          OrderAgainstPO: "針對 PO 的訂單",
          RecordsIsNotAvailableForAboveFilter: "記錄不適用於上述過濾器",
          ManualPO: "手冊PO",
          ScheduledPO: "預定訂單",
          PONo: "波諾",
          Date: "日期",
          Quantity: "數量",
          RMBPrice: "人民幣價格",
          AEDPrice: "迪拉姆價格",
          POStatus: "採購訂單狀態",
          PaymentStatus: "支付狀態",
          Factory: "工廠",
          ViewItem: "查看項目",
          ExchangeAndReturn: "換貨及退貨",
          POtype: "採購訂單類型",
          SelectPO: "選擇採購訂單",
          ProductName: "產品名稱",
          Image: "影像",
          QtyOrdered: "訂購數量",
          ReturnQty: "退貨數量",
          ReturnType: "返回類型",
          ExpectedDeliveryDate: "預計交貨日期",
          Select: "選擇",
          submit: "提交",
          ERManagement: "急診管理",
          DuebyFilter: "按過濾器到期",
          Search: "搜尋",
          ResetFilter: "重置過濾器",
          ERNo: "呃沒有",
          TotalQty: "總數量",
          Status: "地位",
          ReceivedStatus: "收到狀態",
          Action: "行動",
          ERview: "急診室視圖",
          ERQty: "數量",
          AddNote: "新增註釋",
          PageSize: "頁面大小",
          NoExachangeandReturnManagementDataAvailable:
            "無可用的換貨和退貨管理數據!",
          StatusFilter: "狀態過濾器",
          ReceivedQty: "收到數量",
          Update: "更新",
          PleaseSelectFactoryPOtypeAndPO: "請選擇工廠、採購訂單類型和採購訂單",
          ProductImage: "產品圖片",
          PODetails: "採購訂單詳情",
          Variation: "變化",
          ER: "此 PO 不支援換貨或退貨!",
          AvlQty: "平均數量",
          AvlStatus: "平均狀態",
          DispatchStatus: "出貨狀態",
          Open: "打開",
          Checkingwithfactory: "與工廠核對",
          Closed: "關閉",
          All: "全部",
          Confirmed: "確認的",
          Oweek: "1週",
          Tweek: "2週",
          threeWeek: "3週",
          Omonth: "1個月",
          OutofStock: "缺貨",
          Paid: "有薪資的",
          Unpaid: "未付",
          Hold: "抓住",
          Cancelled: "取消",
          GeneralPO: "一般採購訂單",
          Today: "今天",
          Tomorrow: "明天",
          InProgress: "進行中",
          Dispatched: "已派遣",
          NotDispatched: "未出貨",
          PoNo: "採購訂單編號",
          EnterPoNumber: "輸入訂單編號",
          InStock: "有存貨",
        },
        P1ChinaSystem: {
          OrderFulfillmentSystemInChina: "中國的訂單履行系統",
          OrderId: "訂單編號",
          Datefilter: "日期過濾器",
          Dispatchtype: "派遣型",
          TotalOrders: "訂單總數",
          DispatchOrders: "出貨訂單",
          ReserveOrders: "預留訂單",
          PageSize: "頁面尺寸",
          Search: "搜尋",
          ResetFilter: "重置過濾器",
          RecordsIsNotAlert: "記錄不適用於上述過濾器",
          CustomerName: "戶名稱",
          ProductName: "產品名稱",
          ShippingCountry: "運送國家",
          OrderStatus: "訂單狀態",
          printpdf: "列印pdf",
          dispatch: "派遣",
          reserve: "預訂",
          EnterOrderId: "輸入訂單編號",
          ThisOrderTakenBy: "該訂單已被其他用戶接受",
          OrderDetails: "訂單詳情",
          Start: "開始",
          SendToUAE: "寄往阿聯酋",
          Order: "命令",
          CustomerOrder: "與訂單",
          Name: "姓名",
          Phone: "電話",
          CustomerShippingAddress: "客戶送貨地址",
          OrderProcess: "訂單流程",
          ItemId: "商品編號",
          VariantDetails: "變體詳細信息",
          QTY: "數量",
          AvlQTY: "平均數量",
          Attachment: "依戀",
          OnHold: "等候接聽",
          Finish: "結束",
          Messages: "留言",
          CompletedOrderSystemInChina: "完善的中國訂單體系",
          StartDateFilter: "開始日期過濾器",
          CompleteDateFilter: "完整的日期過濾器",
          OnHoldOrdersSystemInChina: "中國的保留訂單系統",
          ReserveOrderSystemInChina: "中國的預訂訂單系統",
          StartedDate: "開始日期",
          EndDate: "結束日期",
          OrderTrackingNumberPending: "訂單追蹤號碼系統",
          TrackingID: "追蹤ID",
          Push: "推",
          Update: "更新",
          Upload: "上傳",
          ExcellSheet:'Excel工作表'
        },
      },
    },
    En: {
      translation: {
        POManagement: {
          title: "PO Order Management System",
          ChangeLanguage: "改變語言",
          DateFilter: "Date Filter",
          FactoryFilter: "Factory Filter",
          POStatusFilter: "PO Status Filter",
          OrderAgainstPO: "Order Agains PO",
          RecordsIsNotAvailableForAboveFilter:
            "Records Is Not Available For Above Filter",
          ManualPO: "Manual PO",
          ScheduledPO: "Scheduled PO",
          PONo: "PO No.",
          Date: "Date",
          Quantity: "Quantity",
          RMBPrice: "RMB Price",
          AEDPrice: "AED Price",
          POStatus: "PO Status",
          PaymentStatus: "Payment Status",
          Factory: "Factory",
          ViewItem: "View Item",
          ExchangeAndReturn: "Exchange And Return",
          POtype: "PO type",
          SelectPO: "Select PO",
          ProductName: "Product Name",
          Image: "Image",
          QtyOrdered: "Qty Ordered",
          ReturnQty: "Return Qty",
          ReturnType: "Return Type",
          ExpectedDeliveryDate: "Expected Delivery Date",
          Select: "Select",
          submit: "submit",
          ERManagement: "ER Management",
          DuebyFilter: "Due by Filter",
          Search: "Search",
          ResetFilter: "Reset Filter",
          ERNo: "ER No",
          TotalQty: "Total Qty",
          Status: "Status",
          ReceivedStatus: "Received Status",
          Action: "Action",
          ERview: "ER view",
          ERQty: "ER Qty",
          AddNote: "Add Note",
          PageSize: "Page Size",
          NoExachangeandReturnManagementDataAvailable:
            "No Exachange and Return Management Data Available",
          StatusFilter: "Status Filter",
          ReceivedQty: "Received Qty",
          Update: "Update",
          PleaseSelectFactoryPOtypeAndPO:
            "Please select Factory, PO type, and PO.",
          ProductImage: "Product Image",
          Variation: "Variation",
          ER: "There are no exchanges or returns for this PO!",
          AvlQty: "Avl Qty",
          AvlStatus: "Avl Status",
          DispatchStatus: "Dispatch Status",
          PODetails: "PO Details",
          Open: "Open",
          Checkingwithfactory: "Checking with factory",
          Closed: "Closed",
          All: "All",
          Confirmed: "Confirmed",
          Oweek: "1 week",
          Tweek: "2 weeks",
          threeWeek: "3 weeks",
          Omonth: "1 Month",
          OutofStock: "Out of Stock",
          Paid: "Paid",
          Unpaid: "Unpaid",
          Hold: "Hold",
          Cancelled: "Cancelled",
          GeneralPO: "General PO",
          Today: "Today",
          Tomorrow: "Tomorrow",
          InProgress: "In Progress",
          Dispatched: "Dispatched",
          NotDispatched: "Not Dispatched",
          PoNo: "PO No.",
          EnterPoNumber: "Enter Po Number",
          InStock: "In Stock",
        },
        P1ChinaSystem: {
          OrderFulfillmentSystemInChina: "Order Fulfillment System In China",
          OrderId: "Order Id",
          Datefilter: "Date filter",
          Dispatchtype: "Dispatch type",
          TotalOrders: "Total Orders",
          DispatchOrders: "Dispatch Orders",
          ReserveOrders: "Reserve Orders",
          PageSize: "Page Size",
          Search: "Search",
          ResetFilter: "Reset Filter",
          RecordsIsNotAlert: "Records is not Available for above filter",
          CustomerName: "Customer Name",
          ProductName: "Product Name",
          ShippingCountry: "Shipping Country",
          OrderStatus: "Order Status",
          printpdf: "print pdf",
          dispatch: "dispatch",
          reserve: "reserve",
          EnterOrderId: "Enter Order Id",
          ThisOrderTakenBy: "This order has already been taken by another user",
          OrderDetails: "Order Details",
          Start: "Start",
          SendToUAE: "Send To UAE",
          Order: "Order",
          CustomerOrder: " Customer & Order",
          Name: "Name",
          Phone: "Phone",
          CustomerShippingAddress: " Customer shipping address",
          OrderProcess: "Order Process",
          ItemId: "Item Id",
          VariantDetails: "Variant Details",
          QTY: "QTY",
          AvlQTY: "Avl QTY",
          Attachment: "Attachment",
          OnHold: "On Hold",
          Finish: "Finish",
          Messages: "Messages",
          CompletedOrderSystemInChina: "Completed Order System In China",
          StartDateFilter: "Start Date Filter",
          CompleteDateFilter: "Complete Date Filter",
          OnHoldOrdersSystemInChina: "On Hold Orders System In China",
          ReserveOrderSystemInChina: "Reserve Order System In China",
          StartedDate: "Started Date",
          EndDate: "End Date",
          OrderTrackingNumberPending: "Order Tracking Number System",
          TrackingID: "Tracking ID",
          Push: "Push",
          Update: "Update",
          Upload: "Upload",
          ExcellSheet:'ExcellSheet'
        },
      },
    },
  },
});

export default i18n;
