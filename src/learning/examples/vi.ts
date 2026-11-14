import type { Challenge, Lesson } from '../types';

// Vietnamese editions of the authored learning content. They keep the same
// ids, section/app/assessment ids, option ids, and correct answers as the
// English originals; localize tests assert that parity.

export const mathematicsFractionsLessonVi: Lesson = {
  id: 'math-fractions-101',
  title: 'Giới thiệu về phân số',
  description: 'Tìm hiểu phân số là gì, cách biểu diễn phân số và các phép tính cơ bản.',
  domain: 'mathematics',
  difficulty: 'beginner',
  language: 'vi',
  reviewStatus: 'draft',
  prerequisites: ['Số học cơ bản'],
  references: [
    'Khan Academy - Trực quan hóa phân số bằng nhau (khanacademy.org)',
    'Math is Fun - Phân số bằng nhau (mathsisfun.com)',
  ],
  sections: [
    {
      id: 'sec-what-is-fraction',
      title: 'Phân số là gì?',
      content: 'Phân số biểu diễn một phần của tổng thể hoặc một phép chia giữa các đại lượng.',
      objectives: [
        'Xác định tử số và mẫu số của một phân số',
        'Biểu diễn phân số bằng hình vẽ và trục số',
      ],
      applications: [
        {
          id: 'app-fraction-strips',
          title: 'Vẽ các dải phân số',
          description:
            'Vẽ một hình chữ nhật, chia thành 5 phần bằng nhau và tô 3 phần. Phần tô là 3/5: mẫu số đếm số phần bằng nhau, tử số đếm số phần bạn lấy. Làm tương tự với 2/4 và so sánh với 1/2.',
          type: 'text',
          resourceId: 'activity-fraction-strips',
        },
      ],
      assessments: [
        {
          id: 'ass-fraction-identify',
          title: 'Bài kiểm tra nhận biết phân số',
          description: 'Nhận biết phân số từ hình vẽ và cách biểu diễn bằng số.',
          type: 'quiz',
          itemIds: ['quiz-frac-id-1', 'quiz-frac-id-2'],
          items: [
            {
              id: 'quiz-frac-id-1',
              prompt: 'Trong phân số 3/5, số 5 biểu diễn điều gì?',
              options: [
                { id: 'a', text: 'Số phần đang được đếm (tử số).' },
                { id: 'b', text: 'Tổng số phần bằng nhau mà tổng thể được chia thành (mẫu số).' },
                { id: 'c', text: 'Kết quả của phép chia 5 cho 3.' },
              ],
              correctOptionId: 'b',
              explanation:
                'Mẫu số (số dưới) cho biết tổng thể gồm bao nhiêu phần bằng nhau. Tử số (số trên, ở đây là 3) đếm số phần ta có.',
            },
            {
              id: 'quiz-frac-id-2',
              prompt: 'Phân số nào bằng 1/2?',
              options: [
                { id: 'a', text: '2/3' },
                { id: 'b', text: '3/4' },
                { id: 'c', text: '4/8' },
              ],
              correctOptionId: 'c',
              explanation:
                '4/8 rút gọn thành 1/2 vì chia cả tử và mẫu cho 4. 2/3 và 3/4 chỉ rút gọn thành chính chúng, nên khác 1/2.',
            },
          ],
        },
      ],
    },
    {
      id: 'sec-equivalent-fractions',
      title: 'Phân số bằng nhau',
      content: 'Các phân số bằng nhau biểu diễn cùng một giá trị dù trông khác nhau.',
      objectives: [
        'Tìm phân số bằng nhau bằng cách nhân hoặc chia cả tử và mẫu',
        'Rút gọn phân số về dạng tối giản',
      ],
      applications: [
        {
          id: 'app-equivalent-fractions-interactive',
          title: 'Nhân để tạo phân số bằng nhau',
          description:
            'Bắt đầu với 1/2. Nhân cả tử và mẫu với 2 để được 2/4, rồi với 3 để được 3/6, rồi với 5 để được 5/10. Tất cả cùng một lượng. Sau đó rút gọn 6/8 bằng cách chia cả tử và mẫu cho 2.',
          type: 'text',
          resourceId: 'activity-eq-fractions',
        },
      ],
      assessments: [
        {
          id: 'ass-equivalent-exercise',
          title: 'Bài tập phân số bằng nhau',
          description:
            'Viết hai phân số bằng 3/4, sau đó rút gọn 9/12 về dạng tối giản. Kiểm tra mỗi đáp án bằng cách nhân chéo.',
          type: 'exercise',
          itemIds: ['exercise-eq-frac-1', 'exercise-eq-frac-2'],
        },
      ],
    },
  ],
};

export const chemistryAcidsBasesLessonVi: Lesson = {
  id: 'chem-acids-bases-101',
  title: 'Hiểu về axit và bazơ',
  description: 'Tìm hiểu tính chất của axit và bazơ, thang pH và các ví dụ quen thuộc.',
  domain: 'chemistry',
  difficulty: 'beginner',
  language: 'vi',
  reviewStatus: 'draft',
  prerequisites: ['Khái niệm cơ bản về vật chất'],
  references: [
    'Khan Academy - Hướng dẫn về axit và bazơ (khanacademy.org)',
    'USGS - pH và nước (usgs.gov)',
  ],
  sections: [
    {
      id: 'sec-properties',
      title: 'Tính chất của axit và bazơ',
      content:
        'Axit là chất cho ion hydro (H⁺) khi tan trong nước, còn bazơ nhận ion hydro hoặc cho ion hydroxit (OH⁻).',
      objectives: [
        'Nhận biết một số axit và bazơ thường gặp',
        'Mô tả tính chất chung của axit và bazơ',
        'Giải thích khái niệm pH',
      ],
      applications: [
        {
          id: 'app-simulation-acid-base',
          title: 'Mô hình CO₂ của axit-bazơ',
          description:
            'Chạy mô phỏng axit-bazơ CO₂ để xem đầu vào làm thay đổi trạng thái kết quả. Đây là mô hình dạy học, không phải công cụ dự đoán phản ứng.',
          type: 'simulation',
          resourceId: 'chemistry.acid-base.co2',
        },
      ],
      assessments: [
        {
          id: 'ass-properties-quiz',
          title: 'Kiểm tra tính chất',
          description: 'Kiểm tra hiểu biết về tính chất của axit và bazơ.',
          type: 'quiz',
          itemIds: ['quiz-props-1', 'quiz-props-2'],
          items: [
            {
              id: 'quiz-props-1',
              prompt: 'Trong nước, bazơ làm gì?',
              options: [
                { id: 'a', text: 'Nó cho ion hydro (H⁺).' },
                { id: 'b', text: 'Nó nhận ion hydro hoặc cho ion hydroxit (OH⁻).' },
                { id: 'c', text: 'Nó luôn có pH dưới 7.' },
              ],
              correctOptionId: 'b',
              explanation:
                'Bazơ nhận H⁺ hoặc giải phóng OH⁻ trong nước, làm pH tăng. Axit cho H⁺, còn pH dưới 7 cho thấy dung dịch có tính axit, không phải bazơ.',
            },
            {
              id: 'quiz-props-2',
              prompt: 'Một dung dịch có pH bằng 3. Dung dịch này thuộc loại nào?',
              options: [
                { id: 'a', text: 'Có tính axit.' },
                { id: 'b', text: 'Trung tính.' },
                { id: 'c', text: 'Có tính bazơ.' },
              ],
              correctOptionId: 'a',
              explanation:
                'Trên thang pH 0-14, giá trị dưới 7 là axit, 7 là trung tính và trên 7 là bazơ. pH bằng 3 có tính axit mạnh.',
            },
          ],
        },
      ],
    },
    {
      id: 'sec-ph-scale',
      title: 'Thang pH',
      content: 'Thang pH đo mức độ axit hoặc bazơ của một chất, từ 0 đến 14. pH bằng 7 là trung tính.',
      objectives: [
        'Đọc và hiểu giá trị pH',
        'Phân loại chất là axit, trung tính hoặc bazơ dựa trên pH',
      ],
      applications: [],
      assessments: [
        {
          id: 'ass-ph-exercise',
          title: 'Bài tập phân loại pH',
          description:
            'Phân loại mỗi chất là axit, trung tính hay bazơ: nước chanh (pH ≈ 2), nước tinh khiết (pH = 7), nước tẩy (pH ≈ 12,5). Giải thích một lựa chọn bằng một câu.',
          type: 'exercise',
          itemIds: ['exercise-ph-1', 'exercise-ph-2', 'exercise-ph-3'],
        },
      ],
    },
  ],
};

export const physicsProjectileLessonVi: Lesson = {
  id: 'phys-projectile-101',
  title: 'Chuyển động ném xiên: tầm xa, độ cao và thời gian bay',
  description:
    'Mô hình hóa cách tốc độ ném, góc ném và trọng lực tạo nên quỹ đạo. Dự đoán tầm xa và độ cao đỉnh, rồi kiểm tra bằng mô phỏng.',
  domain: 'physics',
  difficulty: 'beginner',
  language: 'vi',
  reviewStatus: 'draft',
  prerequisites: ['Phân tích vectơ cơ bản (sin và cos của một góc)'],
  references: [
    'Halliday, Resnick, Walker - Fundamentals of Physics (chương chuyển động ném xiên)',
    'The Physics Classroom: Vectơ và chuyển động ném xiên',
  ],
  sections: [
    {
      id: 'intro',
      title: 'Hình dạng của một cú ném',
      content:
        'Một quả bóng được ném lên sẽ đi theo đường parabol. Chuyển động ngang đều (vận tốc không đổi) trong khi chuyển động dọc là rơi tự do (gia tốc không đổi). Kết hợp hai chuyển động cho ta đường cong quen thuộc.',
      objectives: [
        'Tách chuyển động ngang và chuyển động dọc',
        'Liên hệ đường parabol với trọng lực không đổi',
      ],
      applications: [],
      assessments: [],
    },
    {
      id: 'equations',
      title: 'Các phương trình chuyển động',
      content:
        'Ném với tốc độ v và góc θ. Khi đó vx = v·cos(θ) và vy = v·sin(θ). Thời gian bay là 2·vy/g, tầm xa là vx·thời gian bay, độ cao đỉnh là vy²/(2g). Những công thức này đến trực tiếp từ động học chuyển động ném xiên.',
      objectives: [
        'Áp dụng ba phương trình động học',
        'Nhận ra tính đối xứng của hai góc bù nhau: 30° và 60° có cùng tầm xa',
      ],
      applications: [],
      assessments: [
        {
          id: 'predict-check',
          type: 'quiz',
          title: 'Dự đoán rồi kiểm tra',
          description: 'Kiểm tra hiểu biết về cách điều kiện ném ảnh hưởng đến quỹ đạo.',
          itemIds: ['q-angle', 'q-assumption'],
          items: [
            {
              id: 'q-angle',
              prompt:
                'Hai vật được ném với cùng tốc độ: một vật ở 30°, một vật ở 60°. Tầm xa của chúng thay đổi thế nào?',
              options: [
                { id: 'a', text: 'Vật ném ở 30° bay xa hơn.' },
                { id: 'b', text: 'Hai vật rơi ở cùng tầm xa.' },
                { id: 'c', text: 'Vật ném ở 60° bay xa hơn.' },
              ],
              correctOptionId: 'b',
              explanation:
                'Tầm xa phụ thuộc sin(2θ), và sin(2·30°) = sin(60°) = sin(2·60°) = sin(120°). Hai góc bù nhau (tổng bằng 90°) cho cùng tầm xa, nên 30° và 60° bằng nhau.',
            },
            {
              id: 'q-assumption',
              prompt: 'Mô hình chuyển động ném xiên này giả định điều gì?',
              options: [
                { id: 'a', text: 'Lực cản không khí làm vật chậm lại.' },
                { id: 'b', text: 'Trọng lực thay đổi theo độ cao.' },
                { id: 'c', text: 'Không có lực cản không khí và độ cao ném bằng độ cao rơi.' },
              ],
              correctOptionId: 'c',
              explanation:
                'Mô hình dùng trọng lực không đổi, bỏ qua lực cản không khí và giả định điểm ném, điểm rơi cùng độ cao. Cú ném thực tế sẽ khác, vì vậy mô hình chỉ để học, không để ngắm bắn.',
            },
          ],
        },
      ],
    },
    {
      id: 'simulation',
      title: 'Thử nghiệm với mô hình',
      content:
        'Dùng mô phỏng bên dưới để thay đổi tốc độ, góc và trọng lực. Quan sát tầm xa và độ cao đỉnh thay đổi ra sao, rồi so sánh với dự đoán của bạn.',
      objectives: [
        'Kiểm tra dự đoán bằng mô hình',
        'Liên hệ các giả định (không có lực cản, mặt đất phẳng) với cú ném thực tế',
      ],
      applications: [
        {
          id: 'app-projectile',
          type: 'simulation',
          title: 'Mô hình chuyển động ném xiên',
          description: 'Tính tầm xa, độ cao đỉnh và thời gian bay từ tham số ném.',
          resourceId: 'physics.projectile',
        },
      ],
      assessments: [],
    },
  ],
};

export const biologyCO2O2LessonVi: Lesson = {
  id: 'bio-co2-o2-101',
  title: 'Quang hợp và hô hấp: cân bằng CO₂–O₂',
  description:
    'Khám phá cách ánh sáng, CO₂, nước và diện tích lá điều khiển sự cân bằng giữa quang hợp và hô hấp. Dự đoán khi nào cây trở thành nguồn sản xuất hoặc tiêu thụ oxy.',
  domain: 'biology',
  difficulty: 'beginner',
  language: 'vi',
  reviewStatus: 'draft',
  prerequisites: ['Khái niệm cơ bản về tế bào', 'Trao đổi khí ở thực vật'],
  references: [
    'Quang hợp - Britannica',
    'Hô hấp tế bào - Khan Academy',
  ],
  sections: [
    {
      id: 'intro',
      title: 'Chu kỳ mỗi ngày',
      content:
        'Cây quang hợp khi có ánh sáng, tạo O₂ và tiêu thụ CO₂. Cây hô hấp liên tục, tiêu thụ O₂ và thải CO₂. Cân bằng ròng phụ thuộc vào điều kiện môi trường.',
      objectives: [
        'Mô tả hai quá trình đối lập: quang hợp và hô hấp',
        'Xác định quá trình nào chiếm ưu thế khi có ánh sáng và khi tối',
      ],
      applications: [],
      assessments: [],
    },
    {
      id: 'factors',
      title: 'Điều gì giới hạn quang hợp?',
      content:
        'Các yếu tố giới hạn chính gồm cường độ ánh sáng, lượng CO₂ và nước. Diện tích lá cũng ảnh hưởng đến tốc độ tổng. Tăng một yếu tố thường làm quang hợp tăng cho đến khi yếu tố khác trở thành giới hạn.',
      objectives: [
        'Liệt kê các yếu tố giới hạn thường gặp',
        'Giải thích cách chúng tương tác để quyết định tốc độ tổng',
      ],
      applications: [],
      assessments: [
        {
          id: 'predict-balance',
          type: 'quiz',
          title: 'Dự đoán cân bằng',
          description: 'Với các điều kiện cho trước, xác định cây là nguồn sản xuất hay tiêu thụ O₂ ròng.',
          itemIds: ['q-low-light', 'q-dark'],
          items: [
            {
              id: 'q-low-light',
              prompt: 'Một cây ở trong ánh sáng yếu với CO₂ cao. Trao đổi khí ròng có khả năng cao nhất là gì?',
              options: [
                { id: 'a', text: 'Sản xuất O₂ ròng (quang hợp vượt hô hấp).' },
                { id: 'b', text: 'Tiêu thụ O₂ ròng (hô hấp vượt quang hợp).' },
                { id: 'c', text: 'Trao đổi ròng đúng bằng không.' },
              ],
              correctOptionId: 'b',
              explanation:
                'Quang hợp cần ánh sáng, nên ánh sáng yếu giữ quang hợp ở mức thấp trong khi hô hấp vẫn tiếp diễn. Khi hô hấp vượt quang hợp, cây tiêu thụ O₂ ròng.',
            },
            {
              id: 'q-dark',
              prompt: 'Trong bóng tối hoàn toàn, quá trình nào vẫn diễn ra?',
              options: [
                { id: 'a', text: 'Chỉ quang hợp.' },
                { id: 'b', text: 'Cả quang hợp và hô hấp.' },
                { id: 'c', text: 'Chỉ hô hấp.' },
              ],
              correctOptionId: 'c',
              explanation:
                'Quang hợp cần ánh sáng nên dừng lại trong bóng tối. Hô hấp diễn ra liên tục để cung cấp năng lượng cho tế bào, nên ban đêm cây tiêu thụ O₂ và thải CO₂.',
            },
          ],
        },
      ],
    },
    {
      id: 'simulation',
      title: 'Khám phá sự cân bằng',
      content:
        'Dùng mô hình bên dưới để thay đổi điều kiện và quan sát tốc độ ròng cùng trao đổi khí. Chú ý thời điểm tốc độ ròng cắt qua mức không.',
      objectives: [
        'Hiểu tốc độ quang hợp, hô hấp và tốc độ ròng',
        'Nhận ra điều kiện thuận lợi cho sản xuất O₂ ròng so với tiêu thụ',
      ],
      applications: [
        {
          id: 'app-co2-o2',
          type: 'simulation',
          title: 'Mô hình cân bằng CO₂–O₂',
          description: 'Mô hình heuristic đơn giản về quang hợp so với hô hấp trong các điều kiện khác nhau.',
          resourceId: 'biology.co2-o2',
        },
      ],
      assessments: [],
    },
  ],
};

export const greenhouseCarbonChallengeVi: Challenge = {
  id: 'challenge-greenhouse-carbon',
  title: 'Đo hô hấp của cây bằng Hóa học và Sinh học',
  description:
    'Kết hợp mô hình CO₂ của axit-bazơ với mô hình quang hợp/hô hấp để lý giải nhà kính kín thay đổi thế nào trong một ngày, và cách kiểm chứng thay đổi đó.',
  domain: 'realworld',
  difficulty: 'intermediate',
  language: 'vi',
  prerequisites: ['Kiến thức cơ bản về axit và bazơ', 'Kiến thức cơ bản về quang hợp và hô hấp'],
  references: [
    'Britannica: Quang hợp',
    'Khan Academy: Hô hấp tế bào',
  ],
  realWorldQuestion:
    'Trong một nhà kính kín, CO₂ sẽ tăng hay giảm qua đêm, và làm thế nào để phát hiện, định lượng thay đổi đó bằng hóa học đơn giản?',
  requiredConcepts: [
    'CO₂ được quang hợp tiêu thụ (khi có ánh sáng) và được hô hấp tạo ra (luôn luôn).',
    'Nước cùng CO₂ tạo thành axit cacbonic, làm pH thay đổi - một tín hiệu có thể quan sát.',
    'Trao đổi khí ròng phụ thuộc vào ánh sáng, nhiệt độ và sinh khối thực vật.',
  ],
  steps: [
    'Chạy mô hình CO₂–O₂ ở ánh sáng đầy đủ (ban ngày) và ghi lại tốc độ ròng cùng lượng khí.',
    'Chạy cùng mô hình với ánh sáng gần bằng không (ban đêm) và ghi lại thay đổi.',
    'Dùng mô hình CO₂ của axit-bazơ để liên hệ lượng CO₂ với mức thay đổi pH quan sát được.',
    'Dự đoán chiều thay đổi của CO₂ trong một chu kỳ ngày-đêm đầy đủ và giải thích.',
  ],
  evidence: [
    'Giá trị tốc độ ròng từ mô hình CO₂–O₂ cho ban ngày và ban đêm.',
    'Chiều thay đổi CO₂ suy ra từ mô hình axit-bazơ.',
    'Dự đoán pH bằng văn bản trước và sau giai đoạn qua đêm.',
  ],
  constraints: [
    'Chỉ dùng hai mô hình được cung cấp; không dùng cây thật hoặc hóa chất thật.',
    'Giả định hệ kín, không thông gió và nhiệt độ không đổi.',
  ],
  evaluation:
    'Câu trả lời đúng nêu rằng CO₂ tăng qua đêm (hô hấp chiếm ưu thế khi không có ánh sáng), giảm vào ban ngày khi quang hợp vượt hô hấp, và liên hệ thay đổi CO₂ với việc pH giảm (axit hơn) qua mô hình axit-bazơ. Câu trả lời đúng chiều nhưng thiếu cơ chế được điểm một phần.',
  linkedSimulationIds: ['biology.co2-o2', 'chemistry.acid-base.co2'],
  relatedLessonIds: ['bio-co2-o2-101', 'chem-acids-bases-101'],
};
