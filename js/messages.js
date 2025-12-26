/**
 * MESSAGES.JS - Auto-Generated
 * Taxi Management System
 * Created: 2025-12-25 17:12:04
 * Total: 99 strings from actual code
 */

const MESSAGES = {

  // ===== Errors - שגיאות =====
  ERROR_1: 'הבעיה דווחה',   // Used in: rides.html
  ERROR_2: 'שגיאה ב-OCR: ',   // Used in: payments.html
  ERROR_3: 'שגיאה באימות מסמך: ',   // Used in: drivers.html, driver-profile.js
  ERROR_4: 'שגיאה באישור: ',   // Used in: registrations.html
  ERROR_5: 'שגיאה בביטול חסימה: ',   // Used in: drivers.html
  ERROR_6: 'שגיאה בדחייה: ',   // Used in: registrations.html
  ERROR_7: 'שגיאה בהוספת נהג: ',   // Used in: drivers.html
  ERROR_8: 'שגיאה בהעלאה: ',   // Used in: drivers.html, payments.html
  ERROR_9: 'שגיאה בחסימת נהג: ',   // Used in: drivers.html
  ERROR_10: 'שגיאה בטעינת לוגים: ',   // Used in: dashboard.html
  ERROR_11: 'שגיאה בטעינת נהגים: ',   // Used in: drivers.html, drivers-backup.html
  ERROR_12: 'שגיאה בטעינת נסיעות: ',   // Used in: rides.html
  ERROR_13: 'שגיאה בטעינת נתוני נהג: ',   // Used in: driver-profile.js
  ERROR_14: 'שגיאה בטעינת נתונים: ',   // Used in: drivers.html
  ERROR_15: 'שגיאה בטעינת רישומים: ',   // Used in: registrations.html
  ERROR_16: 'שגיאה בטעינת תשלומים: ',   // Used in: payments.html
  ERROR_17: 'שגיאה בייצוא: ',   // Used in multiple files
  ERROR_18: 'שגיאה ביצירת גיבוי: ',   // Used in: settings.html
  ERROR_19: 'שגיאה ביצירת דוח: ',   // Used in: reports.html
  ERROR_20: 'שגיאה בשינוי סיסמה: ',   // Used in: settings.html
  ERROR_21: 'שגיאה בשליחה: ',   // Used in: messages.html
  ERROR_22: 'שגיאה בשליחת הודעה: ',   // Used in: driver-profile.js
  ERROR_23: 'שגיאה: ',   // Used in multiple files
  ERROR_24: '⚠️ החיבור נכשל - סטטוס: ',   // Used in: settings.html
  ERROR_25: '❌ שגיאה ביצירת גיבוי: ',   // Used in: system.html
  ERROR_26: '❌ שגיאה ביצירת נסיעה: ',   // Used in: rides.html
  ERROR_27: '❌ שגיאה בניקוי לוגים: ',   // Used in: system.html
  ERROR_28: '❌ שגיאה בשמירת הגדרות: ',   // Used in: settings.html
  ERROR_29: '❌ שגיאה בשמירת התראות: ',   // Used in: settings.html
  ERROR_30: '❌ שגיאה בשמירת תמחור: ',   // Used in: settings.html
  ERROR_31: '❌ שגיאת חיבור: ',   // Used in: settings.html

  // ===== Success - הצלחה =====
  SUCCESS_1: 'Cache נוקה בהצלחה',   // Used in: settings.html
  SUCCESS_2: 'OCR הושלם בהצלחה',   // Used in: payments.html
  SUCCESS_3: 'הגיבוי נוצר בהצלחה',   // Used in: settings.html
  SUCCESS_4: 'הדוח יוצא בהצלחה',   // Used in: reports.html
  SUCCESS_5: 'ההודעה נשלחה בהצלחה',   // Used in: driver-profile.js, messages.html
  SUCCESS_6: 'החסימה בוטלה בהצלחה',   // Used in: drivers.html
  SUCCESS_7: 'המסמך אומת בהצלחה',   // Used in: drivers.html, driver-profile.js
  SUCCESS_8: 'הנהג נחסם בהצלחה',   // Used in: drivers.html
  SUCCESS_9: 'הנסיעה בוטלה בהצלחה',   // Used in: rides.js
  SUCCESS_10: 'הסיסמה שונתה בהצלחה',   // Used in: settings.html
  SUCCESS_11: 'הקבלה הועלתה בהצלחה',   // Used in: payments.html
  SUCCESS_12: 'הרישום אושר בהצלחה והנהג נוצר במערכת',   // Used in: registrations.html
  SUCCESS_13: 'התבנית נמחקה',   // Used in: messages.html
  SUCCESS_14: 'התחברת בהצלחה!',   // Used in: index.html
  SUCCESS_15: 'התנתקת בהצלחה',   // Used in: dashboard.js
  SUCCESS_16: 'מסמך הועלה בהצלחה',   // Used in: drivers.html
  SUCCESS_17: 'נסיעה נוצרה בהצלחה!',   // Used in: rides.js
  SUCCESS_18: 'פרופיל נשמר בהצלחה',   // Used in: settings.html
  SUCCESS_19: '✅ הגדרות התראות נשמרו בהצלחה!',   // Used in: settings.html
  SUCCESS_20: '✅ הגדרות כלליות נשמרו בהצלחה!',   // Used in: settings.html
  SUCCESS_21: '✅ הגדרות תמחור נשמרו בהצלחה!',   // Used in: settings.html
  SUCCESS_22: '✅ החיבור לשרת תקין!',   // Used in: settings.html

  // ===== Confirmations - אישורים =====
  CONFIRM_1: 'האם אתה בטוח שברצונך לאשר רישום זה?',   // Used in: registrations.html
  CONFIRM_2: 'האם אתה בטוח שברצונך לאתחל את השרת? פעולה זו תנתק את כל המשתמשים.',   // Used in: settings.html
  CONFIRM_3: 'האם אתה בטוח שברצונך להתנתק?',   // Used in: dashboard.js
  CONFIRM_4: 'האם אתה בטוח שברצונך ליצור גיבוי?',   // Used in: settings.html
  CONFIRM_5: 'האם אתה בטוח שברצונך לנקות את ה-Cache?',   // Used in: settings.html
  CONFIRM_6: 'האם אתה בטוח שברצונך לסמן תשלום זה כשולם?',   // Used in: payments.html
  CONFIRM_7: 'האם לבטל את חסימת הנהג?',   // Used in: drivers.html
  CONFIRM_8: 'האם להתנתק?',   // Used in: system.html, rides.js
  CONFIRM_9: 'האם למחוק תבנית זו?',   // Used in: messages.html
  CONFIRM_10: 'האם לשלוח מחדש לנהגים?',   // Used in: rides.html

  // ===== Validation - ולידציה =====
  VALIDATION_1: 'חובה להזין סיבה',   // Used in: drivers.html
  VALIDATION_2: 'תעודת זהות חייבת להכיל 9 ספרות',   // Used in: drivers.html

  // ===== Labels - תוויות =====
  LABEL_1: 'פורמט טלפון שגוי. השתמש ב: 050-123-4567',   // Used in: drivers.html
  LABEL_2: 'פורמט מספר רכב שגוי. השתמש ב: 12-345-67',   // Used in: drivers.html
  LABEL_3: 'תצוגה מקדימה:\\n\\n',   // Used in: messages.html

  // ===== General - כללי =====
  MSG_1: 'אין טקסט לתצוגה מקדימה',   // Used in: messages.html
  MSG_2: 'בחר נסיעות תחילה',   // Used in: rides.html
  MSG_3: 'הנסיעה נשלחה מחדש',   // Used in: rides.html, rides.js
  MSG_4: 'הסיסמאות אינן תואמות',   // Used in: settings.html
  MSG_5: 'הערה נוספה',   // Used in: drivers.html
  MSG_6: 'הרישום נדחה',   // Used in: registrations.html
  MSG_7: 'התשלום סומן כשולם',   // Used in: payments.html
  MSG_8: 'יותר מדי בקשות. נסה שוב בעוד רגע...',   // Used in: drivers.html
  MSG_9: 'ליצור גיבוי של כל הנתונים?\\n\\nזה עלול לקחת מספר דקות...',   // Used in: system.html
  MSG_10: 'מוחק...',   // Used in: rides.html
  MSG_11: 'מזהה נהג חסר',   // Used in: driver-profile.js
  MSG_12: 'מסמך לא זמין',   // Used in: driver-profile.js
  MSG_13: 'מעלה קבלה...',   // Used in: payments.html
  MSG_14: 'מערכת התשלומים בפיתוח',   // Used in: driver-profile.js
  MSG_15: 'מריץ OCR...',   // Used in: payments.html
  MSG_16: 'נא לבחור זמן שליחה',   // Used in: messages.html
  MSG_17: 'נא לבחור נמען',   // Used in: messages.html
  MSG_18: 'נא להזין טקסט הודעה',   // Used in: messages.html
  MSG_19: 'נא להזין סיסמה',   // Used in: index.html
  MSG_20: 'נתונים עודכנו',   // Used in: dashboard.js
  MSG_21: 'סיסמה שגויה',   // Used in: index.html
  MSG_22: 'עריכת נהג בפיתוח',   // Used in: driver-profile.js
  MSG_23: 'פיצ\'ר דוחות יבוא בקרוב!',   // Used in: payments.html
  MSG_24: 'פיצ\'ר הוספת תשלום יבוא בקרוב!',   // Used in: payments.html
  MSG_25: 'פיצ\'ר יצירת קמפיין יבוא בקרוב!',   // Used in: messages.html
  MSG_26: 'פיצ\'ר צפייה בפרטים יבוא בקרוב!',   // Used in: registrations.html
  MSG_27: 'פיצ\'ר צפייה בקמפיין יבוא בקרוב!',   // Used in: messages.html
  MSG_28: 'פיצ\'ר שליחת הודעה יבוא בקרוב!',   // Used in: registrations.html
  MSG_29: 'פיצ׳ר זה יהיה זמין בקרוב',   // Used in: rides.js
  MSG_30: 'שרת מאתחל... אנא המתן',   // Used in: settings.html
  MSG_31: 'תעודת זהות לא תקינה',   // Used in: drivers.html

};

// Export
if (typeof module !== "undefined" && module.exports) {
  module.exports = MESSAGES;
}