import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources: {
      Zn: {
        translation: {
          POManagement: {
            title: 'PO訂單管理系統',
            ChangeLanguage:'改變語言',
            DateFilter: '日期過濾器',
            FactoryFilter: '工廠過濾器',
            POStatusFilter: '採購訂單狀態篩選器',
            OrderAgainstPO: '針對 PO 的訂單',
            RecordsIsNotAvailableForAboveFilter: '記錄不適用於上述過濾器',
            ManualPO: '手冊PO',
            ScheduledPO:'預定訂單',
            PONo:'波諾',
            Date:'日期',
            Quantity:'數量',
            RMBPrice:'人民幣價格',
            AEDPrice:'迪拉姆價格',
            POStatus:'採購訂單狀態',
            PaymentStatus:'支付狀態',
            Factory:'工廠',
            ViewItem:'查看項目',
            ExchangeAndReturn:'換貨及退貨',
            POtype:'採購訂單類型',
            SelectPO:'選擇採購訂單',
            ProductName:'產品名稱',
            Image:'影像',
            QtyOrdered:'訂購數量',
            ReturnQty:'退貨數量',
            ReturnType:'返回類型',
            ExpectedDeliveryDate:'預計交貨日期',
            Select:'選擇',
            submit:'提交',
            ERManagement:'急診管理',
            DuebyFilter:'按過濾器到期',
            Search:'搜尋',
            ResetFilter:'重置過濾器',
            ERNo:'呃沒有',
            TotalQty:'總數量',
            Status:'地位',
            ReceivedStatus:'收到狀態',
            Action:'行動',
            ERview:'急診室視圖',
            ERQty:'數量',
            AddNote:'新增註釋',
            PageSize:'頁面大小',
            NoExachangeandReturnManagementDataAvailable:'無可用的換貨和退貨管理數據!',
            StatusFilter:'狀態過濾器',
            ReceivedQty:'收到數量',
            Update:'更新',
            PleaseSelectFactoryPOtypeAndPO:'請選擇工廠、採購訂單類型和採購訂單',
            ProductImage:'產品圖片',
            PODetails:'採購訂單詳情',
            Variation:'變化',
            ER:'此 PO 不支援換貨或退貨!',
            AvlQty:'平均數量',
            AvlStatus:"平均狀態",
            DispatchStatus:'出貨狀態',
          }
        }
      },
      En: {
        translation: {
          POManagement: {
            title: 'PO Order Management System',
            ChangeLanguage:'改變語言',
            DateFilter: 'Date Filter',
            FactoryFilter: 'Factory Filter',
            POStatusFilter: 'PO Status Filter',
            OrderAgainstPO: 'Order Agains PO',
            RecordsIsNotAvailableForAboveFilter: 'Records Is Not Available For Above Filter',
            ManualPO: 'Manual PO',
            ScheduledPO:'Scheduled PO',
            PONo:'PO No.',
            Date:'Date',
            Quantity:'Quantity',
            RMBPrice:'RMB Price',
            AEDPrice:'AED Price',
            POStatus:'PO Status',
            PaymentStatus:'Payment Status',
            Factory:'Factory',
            ViewItem:'View Item',
            ExchangeAndReturn:'Exchange And Return',
            POtype:'PO type',
            SelectPO:'Select PO',
            ProductName:'Product Name',
            Image:'Image',
            QtyOrdered:'Qty Ordered',
            ReturnQty:'Return Qty',
            ReturnType:'Return Type',
            ExpectedDeliveryDate:'Expected Delivery Date',
            Select:'Select',
            submit:'submit',
            ERManagement:'ER Management',
            DuebyFilter:'Due by Filter',
            Search:'Search',
            ResetFilter:'Reset Filter',
            ERNo:'ER No',
            TotalQty:'Total Qty',
            Status:'Status',
            ReceivedStatus:'Received Status',
            Action:'Action',
            ERview:'ER view',
            ERQty:'ER Qty',
            AddNote:'Add Note',
            PageSize:'Page Size',
            NoExachangeandReturnManagementDataAvailable:'No Exachange and Return Management Data Available',
            StatusFilter:'Status Filter',
            ReceivedQty:'Received Qty',
            Update:'Update',
            PleaseSelectFactoryPOtypeAndPO:'Please select Factory, PO type, and PO.',
            ProductImage:'Product Image',
            Variation:'Variation',
            ER:'There are no exchanges or returns for this PO!',
            AvlQty:'Avl Qty',
            AvlStatus:"Avl Status",
            DispatchStatus:'Dispatch Status',
            PODetails:'PO Details'
          }
        }
      },
    }
  });

export default i18n;