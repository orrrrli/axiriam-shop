const pexels = (id: number, w = 1200) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

export const estudioContent = {
  hero: {
    badge: 'Nuestro Estudio',
    title: 'Donde nace\ncada gorro.',
    subtitle:
      'Detrás de cada pieza hay un proceso artesanal que combina precisión técnica con diseño pensado para el profesional de la salud.',
    cta: { label: 'Ver colección', href: '/catalogo' },
    images: [
      { src: pexels(3938023), alt: 'Profesional de la salud en quirófano' },
      { src: pexels(6551076), alt: 'Tela de alta calidad en atelier' },
      { src: pexels(7551490), alt: 'Costura artesanal de gorros quirúrgicos' },
      { src: pexels(5452268), alt: 'Colección de gorros Axiriam' },
    ],
  },

  about: {
    title: 'Calidad que se\nsiente desde\nel primer uso.',
    description:
      'En Axiriam combinamos materiales seleccionados con técnicas de confección de alto estándar. Cada gorro quirúrgico es diseñado para ofrecer comodidad durante jornadas largas, cumpliendo con las normativas de higiene más exigentes del sector salud. Somos una marca argentina que entiende las necesidades reales de médicos, enfermeros y profesionales de la salud.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },

  howItWorks: {
    title: 'Cómo trabajamos',
    steps: [
      {
        number: '01',
        icon: 'Scissors',
        title: 'Selección de telas',
        description:
          'Elegimos telas de algodón 100% certificadas, con propiedades antibacteriales y resistencia al lavado industrial.',
      },
      {
        number: '02',
        icon: 'Ruler',
        title: 'Corte y confección',
        description:
          'Cada gorro se corta con patrones ergonómicos y se confecciona con costuras reforzadas para mayor durabilidad.',
      },
      {
        number: '03',
        icon: 'Package',
        title: 'Control de calidad',
        description:
          'Revisamos cada unidad antes del empaque para garantizar que cumple con nuestros estándares de terminación premium.',
      },
    ],
  },

  mission: {
    statement:
      'Creamos gorros que permiten a los profesionales de la salud expresar su identidad sin sacrificar la funcionalidad.',
    image: { src: pexels(3760137), alt: 'Equipo Axiriam trabajando en el estudio' },
  },

  history: {
    title: 'Nuestra historia',
    body: 'Axiriam nació en Buenos Aires con una idea simple: los profesionales de la salud merecen equipamiento que los represente. Empezamos con una máquina de coser y una visión clara — gorros quirúrgicos que combinan estética y funcionalidad. Hoy atendemos a más de 500 profesionales en todo el país, manteniendo la misma pasión artesanal del primer día.',
    image: { src: pexels(4386370), alt: 'Origen artesanal de Axiriam en Buenos Aires' },
    quote: {
      text: 'No fabricamos uniformes. Creamos prendas que acompañan vocaciones.',
      author: '— Fundadores de Axiriam',
    },
  },

  testimonials: {
    title: 'Lo que dicen nuestros profesionales',
    items: [
      {
        name: 'Dra. Valentina Reyes',
        role: 'Cirujana — Hospital Italiano, Buenos Aires',
        text: 'Uso gorros Axiriam desde hace dos años. La diferencia en comodidad durante guardias largas es notable. El ajuste es perfecto y los estampados son realmente únicos.',
        rating: 5,
      },
      {
        name: 'Lic. Marcos Pérez',
        role: 'Enfermero Quirúrgico — Sanatorio Güemes',
        text: 'La calidad de las telas es superior a todo lo que probé antes. Se mantienen impecables después de muchos lavados a alta temperatura. Los recomiendo sin dudarlo.',
        rating: 5,
      },
      {
        name: 'Dra. Sofía Linares',
        role: 'Odontóloga — Consultorio privado, Córdoba',
        text: 'Pedí para todo mi equipo y el resultado fue increíble. Mis pacientes noten la diferencia y nosotros nos sentimos más cómodos y profesionales.',
        rating: 5,
      },
    ],
  },

  ctaBanner: {
    title: 'Tu próximo favorito\nte está esperando.',
    subtitle: 'Explorá nuestra colección de gorros quirúrgicos y encontrá el que mejor te representa.',
    cta: { label: 'Ver catálogo completo', href: '/catalogo' },
  },

  links: {
    title: 'Axiriam',
    columns: [
      {
        heading: 'Tienda',
        links: [
          { label: 'Todos los gorros', href: '/catalogo' },
          { label: 'Gorros estampados', href: '/catalogo?category=estampados' },
          { label: 'Gorros lisos', href: '/catalogo?category=lisos' },
          { label: 'Edición limitada', href: '/catalogo?category=limitada' },
        ],
      },
      {
        heading: 'Estudio',
        links: [
          { label: 'Nuestra historia', href: '/estudio#historia' },
          { label: 'Cómo trabajamos', href: '/estudio#proceso' },
          { label: 'Materiales', href: '/estudio#materiales' },
          { label: 'Comunidad', href: '/nosotros' },
        ],
      },
      {
        heading: 'Ayuda',
        links: [
          { label: 'Preguntas frecuentes', href: '/faq' },
          { label: 'Guía de tallas', href: '/guia-tallas' },
          { label: 'Envíos y devoluciones', href: '/envios' },
          { label: 'Contacto', href: '/contacto' },
        ],
      },
    ],
  },
};
