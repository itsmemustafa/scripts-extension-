const DEFAULT_DATA = {
  categories: ["driver", "customer", "general"],
  scripts: [
    {
      id: "seed-driver-delay",
      category: "driver",
      title: "Driver delayed",
      text: {
        ar: "مرحباً كابتن، نلاحظ أنك متأخر عن موقع العميل. هل تواجه أي مشكلة في الطريق أو هل تحتاج إلى مساعدة؟",
        en: "Hello Captain, we noticed you are delayed in reaching the customer's location. Are you facing any issues on the road or do you need assistance?",
        ckb: "سڵاو کاپتن، بینیمان کەمێک دواکەوتوویت بۆ گەیشتن بە کڕیار. کێشەیەکت هەیە لە ڕێگادا، یان پێویستت بە یارمەتییە؟"
      },
      updatedAt: "2026-06-21T23:50:00.000Z"
    },
    {
      id: "seed-driver-cancel",
      category: "driver",
      title: "Driver cancelled order",
      text: {
        ar: "كابتن، تم إلغاء الطلب بناءً على طلبك. يرجى توخي الحذر والتأكد من تحديث حالتك في التطبيق لتلقي رحلات أخرى.",
        en: "Captain, the ride has been cancelled as per your request. Please stay safe and ensure your status is updated in the app to receive other trips.",
        ckb: "کاپتن، گەشتەکە بەپێی داواکارییەکەی خۆت هەڵوەشێنرایەوە. ئاگاداربە، و دۆخەکەت لە ئەپدا نوێ بکەرەوە تاکو گەشتی تر بۆت بێت."
      },
      updatedAt: "2026-06-21T23:50:00.000Z"
    },
    {
      id: "seed-driver-gps",
      category: "driver",
      title: "Check driver GPS location",
      text: {
        ar: "مرحباً كابتن، يرجى مشاركة موقعك الحالي بدقة أو التأكد من تشغيل نظام تحديد المواقع (GPS) الخاص بك لنتمكن من متابعة الطلب.",
        en: "Hello Captain, please share your precise current location or ensure your GPS is enabled so we can track the order status.",
        ckb: "سڵاو کاپتن، تکایە شوێنی ئێستات وەربگرە، یان دڵنیابە کە GPSەکەت کارایە تاکو بتوانین گەشتەکە چاودێری بکەین."
      },
      updatedAt: "2026-06-21T23:50:00.000Z"
    },
    {
      id: "seed-driver-wrong-loc",
      category: "driver",
      title: "Registered location is wrong",
      text: {
        ar: "كابتن، يرجى التحقق من العنوان المسجل في الطلب والتأكد من تطابقه مع موقع العميل لتفادي التأخير.",
        en: "Captain, please double check the address registered in the order and ensure it matches the customer's actual location to avoid delays.",
        ckb: "کاپتن، تکایە ناونیشانەکەی گەشتەکە دووبارە بپشکنە، دڵنیابە لەوەی لەگەڵ شوێنی ڕاستەقینەی کڕیار یەکدەگرنەوە تاکو دواکەوتن نەبێت."
      },
      updatedAt: "2026-06-21T23:50:00.000Z"
    },
    {
      id: "seed-customer-confirm",
      category: "customer",
      title: "Confirm order to customer",
      text: {
        ar: "أهلاً بك، تم تأكيد طلبك بنجاح. السائق في طريقه إليك الآن، ويمكنك متابعة رحلته عبر الخريطة.",
        en: "Welcome! Your order has been successfully confirmed. The driver is on their way to you now, and you can track their journey on the map.",
        ckb: "سڵاو، گەشتەکەت پشتڕاست کرایەوە. ئێستا شۆفێر لە ڕێگایە بۆ لات، لەسەر نەخشە دەتوانیت گەشتەکەی بزانیت."
      },
      updatedAt: "2026-06-21T23:50:00.000Z"
    },
    {
      id: "seed-customer-wait",
      category: "customer",
      title: "Customer wait request",
      text: {
        ar: "عزيزي العميل، نعتذر عن التأخير البسيط بسبب حركة المرور. يرجى الانتظار لبضع دقائق أخرى، والسائق سيكون عندك قريباً.",
        en: "Dear customer, we apologize for the slight delay due to traffic. Please wait a few more minutes, and the driver will be with you shortly.",
        ckb: "ببورە لە دواکەوتنەکە، هۆکارەکەی هاتووچۆیە. تکایە چەند خولەکێک چاوەڕێ بە، شۆفێر بەزووی دەگاتە لات."
      },
      updatedAt: "2026-06-21T23:50:00.000Z"
    },
    {
      id: "seed-customer-complaint",
      category: "customer",
      title: "Customer complaint against driver",
      text: {
        ar: "مرحباً، نأسف جداً لسماع ذلك وتجربتك السيئة. لقد قمنا بتسجيل الشكوى ضد السائق وسيتم مراجعتها من قبل قسم الجودة فوراً.",
        en: "Hello, we are very sorry to hear about your bad experience. We have registered the complaint against the driver and it will be reviewed by the quality department immediately.",
        ckb: "زۆر ببورە لەو شتەی ڕووی داوە. سکاڵاکەت تۆمار کرا و بەشی کوالیتی هەر ئێستا چاوی پێ دەخشێنێت."
      },
      updatedAt: "2026-06-21T23:50:00.000Z"
    },
    {
      id: "seed-customer-cancel",
      category: "customer",
      title: "Customer cancelled order",
      text: {
        ar: "مرحباً، تم إلغاء طلبك بناءً على رغبتك. نتمنى لك يوماً سعيداً ويسعدنا خدمتك في المرات القادمة.",
        en: "Hello, your order has been cancelled as per your request. We wish you a great day and look forward to serving you next time.",
        ckb: "سڵاو، گەشتەکەت بەپێی خواستی خۆت هەڵوەشێنرایەوە. ڕۆژێکی خۆشت بۆ دەخوازین، جارێکی تر چاوەڕێی خزمەتکردنتین."
      },
      updatedAt: "2026-06-21T23:50:00.000Z"
    },
    {
      id: "seed-customer-arrived",
      category: "customer",
      title: "Driver arrived at location",
      text: {
        ar: "عزيزي العميل، لقد وصل السائق إلى نقطة الالتقاء المحددة وهو بانتظارك الآن. يرجى التوجه إليه.",
        en: "Dear customer, the driver has arrived at the designated pickup point and is waiting for you. Please proceed to the vehicle.",
        ckb: "شۆفێر گەیشتووەتە خاڵی دیاریکراو و چاوەڕێتە. تکایە بەرەو ئۆتۆمبێلەکە بڕۆ."
      },
      updatedAt: "2026-06-21T23:50:00.000Z"
    },
    {
      id: "seed-general-welcome",
      category: "general",
      title: "General welcome to customer",
      text: {
        ar: "مرحباً بك في مركز الدعم الخاص بنا. كيف يمكنني مساعدتك اليوم؟",
        en: "Welcome to our support center. How can I assist you today?",
        ckb: "بەخێربێیت بۆ پشتگیری ئێمە. چۆن دەتوانم یارمەتیت بدەم؟"
      },
      updatedAt: "2026-06-21T23:50:00.000Z"
    },
    {
      id: "seed-general-close",
      category: "general",
      title: "Close support chat",
      text: {
        ar: "يسعدنا جداً خدمتك اليوم. إذا كان لديك أي استفسار آخر لا تتردد في الاتصال بنا. طاب يومك!",
        en: "It was a pleasure serving you today. If you have any further questions, please do not hesitate to contact us. Have a great day!",
        ckb: "خۆشحاڵ بووین بە خزمەتکردنت. هەر پرسیارێکی ترت هەبوو پەیوەندیمان پێوە بکە. ڕۆژێکی خۆش!"
      },
      updatedAt: "2026-06-21T23:50:00.000Z"
    },
    {
      id: "seed-general-feedback",
      category: "general",
      title: "Request service rating",
      text: {
        ar: "عزيزي العميل، نرجو منك تقييم مستوى الخدمة المقدمة لك اليوم لمساعدتنا في تحسين خدماتنا باستمرار. شكراً لك!",
        en: "Dear customer, please rate the quality of service provided to you today to help us continuously improve. Thank you!",
        ckb: "تکایە خزمەتگوزارییەکەمان هەڵسەنگێنە، یارمەتیمان دەدەیت باشتر بین. سوپاس!"
      },
      updatedAt: "2026-06-21T23:50:00.000Z"
    }
  ]
};