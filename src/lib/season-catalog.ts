export const SEASON_PRICE = 37;
export const SEASON_CATALOG = [
  {
    "id": "codigo-espacial",
    "title": "O Código da Estação Espacial",
    "intro": "Uma transmissão se perdeu entre as estrelas. Reative os sistemas da estação antes da próxima partida.",
    "benefit": "Decifrar sinais, contar estrelas e organizar uma viagem espacial.",
    "color": "#122c55",
    "logo": "/aventuras/codigo-espacial-logo.webp",
    "scene": "/aventuras/codigo-espacial-cenario.webp"
  },
  {
    "id": "floresta-antiga",
    "title": "O Segredo da Floresta Antiga",
    "intro": "O portal da floresta perdeu sua canção. Reúna os sinais da natureza para abri-lo outra vez.",
    "benefit": "Observar padrões, descobrir ciclos e cuidar da floresta.",
    "color": "#244827",
    "logo": "/aventuras/floresta-antiga-logo.webp",
    "scene": "/aventuras/floresta-antiga-cenario.webp"
  },
  {
    "id": "misterio-museu",
    "title": "Mistério no Museu",
    "intro": "Uma peça saiu de sua vitrine. Sigam as anotações do curador para descobrir onde ela foi guardada.",
    "benefit": "Investigar detalhes, comparar pistas e resolver códigos.",
    "color": "#593b23",
    "logo": "/aventuras/misterio-museu-logo.webp",
    "scene": "/aventuras/misterio-museu-cenario.webp"
  },
  {
    "id": "resgate-animal",
    "title": "O Resgate dos Animais",
    "intro": "A raposa e a coruja precisam encontrar o caminho até o abrigo. Uma equipe atenta pode ajudar.",
    "benefit": "Interpretar rastros, reconhecer abrigos e cooperar.",
    "color": "#66502a",
    "logo": "/aventuras/resgate-animal-logo.webp",
    "scene": "/aventuras/resgate-animal-cenario.webp"
  },
  {
    "id": "enigma-farol",
    "title": "O Enigma do Farol",
    "intro": "A luz do farol parou de piscar. Reúnam as mensagens da costa e devolvam o sinal aos navegantes.",
    "benefit": "Descobrir sequências, direções e sinais de luz.",
    "color": "#153c51",
    "logo": "/aventuras/enigma-farol-logo.webp",
    "scene": "/aventuras/enigma-farol-cenario.webp"
  }
] as const;
export type SeasonId = typeof SEASON_CATALOG[number]["id"];
