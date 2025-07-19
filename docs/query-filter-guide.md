# 📘 API Query Filters Documentation

توثيق لاستخدام الفلاتر والاستعلامات في الـ API عبر Query Parameters.

---

## 🎯 الهدف

تمكين المستخدم من إجراء عمليات تصفية متقدمة (Advanced Filtering) باستخدام Operators مثل:  
`in`, `nin`, `gt`, `lt`, `eq`, `ne` على الحقول المختلفة من خلال الـ Query Parameters.

---

## 📦 البنية العامة (Syntax)

> `field`: اسم الحقل  
> `operator`: عامل المقارنة (مثل `gt`, `in`, ...)  
> `value`: القيمة أو القيم المراد التصفية بها

---

## 🛠️ العوامل المدعومة (Supported Operators)

| Operator | MongoDB Equivalent | Description         |
| -------- | ------------------ | ------------------- |
| `eq`     | `$eq`              | يساوي               |
| `ne`     | `$ne`              | لا يساوي            |
| `gt`     | `$gt`              | أكبر من             |
| `lt`     | `$lt`              | أصغر من             |
| `in`     | `$in`              | موجود ضمن قائمة     |
| `nin`    | `$nin`             | غير موجود ضمن قائمة |

---

## 🧪 أمثلة (Examples)

### ✅ المساواة

```http
GET /users?gender_eq=male

GET /users?status_ne=inactive

GET /users?age_gt=18

GET /users?age_lt=40

GET /users?role_in=admin7role_in =user

GET /users?city_nin=paris7city_nin=london

GET /users?search=john

GET /users?age_gt=18&gender_eq=male&status_ne=inactive

➡️ النتيجة: المستخدمون الذكور، أعمارهم أكبر من 18، وليسوا inactive.


```

هل ترغب أن أضيف أيضًا قسمًا حول "Pagination" و"Sorting"؟
