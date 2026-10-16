export const programManifest = [
  { id: 'school-readiness', slug: 'hanh-trang-vao-lop-1', titleVi: 'Hành trang vào lớp 1', titleEn: 'School Readiness', descriptionVi: 'Cùng Bibo khám phá những câu chuyện thú vị.', descriptionEn: 'Explore maths with Bibo through 27 interactive lessons.', status: 'active', order: 1, moduleIds: ['readiness-quantity', 'readiness-compare-order', 'readiness-number-composition', 'readiness-operations', 'readiness-number-reasoning', 'readiness-measure-shape-pattern'] },
  ...[1, 2, 3, 4, 5].map((grade) => ({ id: `grade-${grade}`, slug: `lop-${grade}`, titleVi: `Toán tư duy ${grade}`, titleEn: `Grade ${grade} Mathematics`, descriptionVi: 'Chương trình đang được biên soạn.', descriptionEn: 'This programme is being prepared.', status: 'coming-soon', order: grade + 1, moduleIds: [] })),
  { id: 'medal-challenge', slug: 'chinh-phuc-huy-chuong', titleVi: 'Chinh phục huy chương', titleEn: 'Medal Challenge', descriptionVi: 'Các thử thách sẽ sớm sẵn sàng.', descriptionEn: 'Challenges are coming soon.', status: 'coming-soon', order: 7, moduleIds: [] },
]

export const activeProgram = programManifest[0]
