# Groups
## base url http://localhost:8080

## groups
-id
-name 
-teacher_id
-assistent_teacher_id

## GET /groups [*]  barcha group ni olish

## GET /groups/:id [*]  bitta groupni olish

## POST /groups ['admin', 'super_admin']  group qo'shish

## PATCH /groups/:id ['admin', 'super_admin'] group update qilish

## DELETE /groups/:id ['admin', 'super_admin'] group o'chirish


## groups_students

## POST /groups/:id/students/:student_id ['admin', 'super_admin'] guruhga studentni qo'shish

## DELETE /groups/:id/students/:student_id ['admin', 'super_admin'] guruhdan student chopish