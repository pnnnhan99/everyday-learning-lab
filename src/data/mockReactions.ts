import type { Element, Reaction } from '../types/game';

export const elements: Element[] = [
  {
    id: 'lemon',
    name: 'Lemon Juice',
    icon: '🍋',
    description: 'Citric acid from a squeezed lemon. pH around 2.',
    type: 'acid',
    vi: {
      name: 'Nước chanh',
      description: 'Axit citric từ chanh vắt. pH khoảng 2.',
    },
  },
  {
    id: 'baking-soda',
    name: 'Baking Soda',
    icon: '🧂',
    description: 'Sodium bicarbonate, a mild base used in kitchens.',
    type: 'base',
    vi: {
      name: 'Muối nở',
      description: 'Natri bicarbonat, một bazơ nhẹ thường dùng trong nhà bếp.',
    },
  },
  {
    id: 'bleach',
    name: 'Bleach',
    icon: '🧴',
    description: 'Sodium hypochlorite solution. Powerful oxidiser.',
    type: 'chemical',
    vi: {
      name: 'Nước tẩy',
      description: 'Dung dịch natri hypoclorit. Chất oxy hóa mạnh.',
    },
  },
  {
    id: 'vinegar',
    name: 'Vinegar',
    icon: '🍶',
    description: 'Dilute acetic acid, roughly pH 3.',
    type: 'acid',
    vi: {
      name: 'Giấm',
      description: 'Axit axetic loãng, pH khoảng 3.',
    },
  },
];

export const reactions: Reaction[] = [
  {
    element1Id: 'lemon',
    element2Id: 'baking-soda',
    resultTitle: 'Carbon dioxide bubbles',
    observation: 'The model predicts bubbles as carbon dioxide enters the gas phase.',
    explanation:
      'In an aqueous acid-base model, acid reacts with bicarbonate to produce carbon dioxide. This does not establish a cleaning effect.',
    effectType: 'informational',
    reviewStatus: 'reviewed',
    assumptions: [
      'Treats lemon juice as an aqueous acid and baking soda as sodium bicarbonate.',
      'Does not model concentrations, quantities, side products, or the rate of gas release.',
    ],
    safetyGuidance: 'Educational model only. Do not use it as instructions for mixing substances in real life.',
    vi: {
      resultTitle: 'Bọt khí carbon dioxide',
      observation: 'Mô hình dự đoán có bọt khí khi carbon dioxide chuyển sang pha khí.',
      explanation:
        'Trong mô hình axit–bazơ trong dung dịch nước, axit phản ứng với bicarbonat tạo ra carbon dioxide. Điều này không chứng minh tác dụng làm sạch.',
      assumptions: [
        'Coi nước chanh là axit trong dung dịch nước và muối nở là natri bicarbonat.',
        'Không mô hình hóa nồng độ, lượng chất, sản phẩm phụ hay tốc độ thoát khí.',
      ],
      safetyGuidance:
        'Chỉ là mô hình giáo dục. Không dùng làm hướng dẫn pha trộn chất trong đời thực.',
    },
    references: [
      {
        title: 'Occurrence, Preparation, and Properties of Carbonates',
        publisher: 'OpenStax Chemistry: Atoms First 2e',
        url: 'https://openstax.org/books/chemistry-atoms-first-2e/pages/18-6-occurrence-preparation-and-properties-of-carbonates',
      },
    ],
  },
  {
    element1Id: 'bleach',
    element2Id: 'vinegar',
    resultTitle: 'Chlorine Gas',
    observation: 'Potential release of highly irritating chlorine gas.',
    explanation:
      'Acidifying sodium hypochlorite bleach can release chlorine gas. The exact outcome depends on the product and conditions.',
    effectType: 'toxic',
    reviewStatus: 'hazard-reviewed',
    assumptions: [
      'Represents acidification of a sodium hypochlorite bleach product; formulations and conditions vary.',
      'Does not predict gas quantity, exposure, or individual health effects.',
    ],
    safetyGuidance:
      'Serious hazard: never mix bleach with vinegar, acids, ammonia, or other cleaners. Do not attempt this outside the simulation.',
    vi: {
      resultTitle: 'Khí clo',
      observation: 'Có thể giải phóng khí clo gây kích ứng mạnh.',
      explanation:
        'Axit hóa nước tẩy natri hypoclorit có thể giải phóng khí clo. Kết quả cụ thể phụ thuộc vào sản phẩm và điều kiện.',
      assumptions: [
        'Mô phỏng việc axit hóa một sản phẩm nước tẩy natri hypoclorit; công thức và điều kiện có thể khác nhau.',
        'Không dự đoán lượng khí, mức phơi nhiễm hay ảnh hưởng sức khỏe của từng người.',
      ],
      safetyGuidance:
        'Nguy hiểm nghiêm trọng: không bao giờ trộn thuốc tẩy với giấm, axit, amoniac hoặc chất tẩy rửa khác. Không thử điều này ngoài mô phỏng.',
    },
    references: [
      {
        title: 'No, vinegar is not always safe',
        publisher: 'Poison Control',
        url: 'https://www.poison.org/articles/vinegar-164',
      },
    ],
  },
];

export function validatePublishedReactions(entries: Reaction[]): void {
  for (const reaction of entries) {
    if (
      !['reviewed', 'hazard-reviewed'].includes(reaction.reviewStatus) ||
      reaction.observation.trim() === '' ||
      reaction.explanation.trim() === '' ||
      reaction.assumptions.length === 0 ||
      reaction.assumptions.some((assumption) => assumption.trim() === '') ||
      reaction.safetyGuidance.trim() === '' ||
      reaction.references.length === 0 ||
      reaction.references.some(
        (reference) =>
          reference.title.trim() === '' ||
          reference.publisher.trim() === '' ||
          !reference.url.startsWith('https://'),
      )
    ) {
      throw new Error(`Published reaction ${reaction.element1Id}/${reaction.element2Id} is missing review metadata.`);
    }
  }
}

validatePublishedReactions(reactions);

export function findReaction(firstId: string, secondId: string): Reaction | undefined {
  return reactions.find(
    (reaction) =>
      (reaction.element1Id === firstId && reaction.element2Id === secondId) ||
      (reaction.element1Id === secondId && reaction.element2Id === firstId),
  );
}
