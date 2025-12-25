import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  'pt-MZ': {
    translation: {
      "app_name": "Controle de Venda",
      "login": "Entrar",
      "logout": "Sair",
      "login_with_google": "Entrar com Google",
      "welcome": "Bem-vindo",
      "dashboard": "Painel",
      "products": "Produtos",
      "scanner": "Scanner",
      "history": "Histórico",
      "reports": "Relatórios",
      "support": "Suporte",
      "settings": "Configurações",
      "product_name": "Nome do Produto",
      "barcode": "Código de Barras",
      "current_stock": "Stock Actual",
      "purchase_price": "Preço de Compra",
      "sale_price": "Preço de Venda",
      "currency": "Moeda",
      "add_product": "Adicionar Produto",
      "edit_product": "Editar Produto",
      "delete_product": "Eliminar Produto",
      "scan_barcode": "Escanear Código",
      "entry": "Entrada",
      "exit": "Saída",
      "quantity": "Quantidade",
      "note": "Nota",
      "date": "Data",
      "type": "Tipo",
      "add_movement": "Adicionar Movimento",
      "movement_type": "Tipo de Movimento",
      "entrada": "Entrada",
      "saida": "Saída",
      "save": "Guardar",
      "cancel": "Cancelar",
      "search": "Pesquisar",
      "no_products": "Sem produtos",
      "no_movements": "Sem movimentos",
      "total_products": "Total de Produtos",
      "total_stock_value": "Valor Total do Stock",
      "potential_revenue": "Receita Potencial",
      "low_stock_alert": "Alerta de Stock Baixo",
      "profit": "Lucro",
      "margin": "Margem",
      "markup": "Markup",
      "convert_currency": "Converter Moeda",
      "from": "De",
      "to": "Para",
      "amount": "Montante",
      "convert": "Converter",
      "language": "Idioma",
      "base_currency": "Moeda Base",
      "theme": "Tema",
      "light": "Claro",
      "dark": "Escuro",
      "contact_support": "Contactar Suporte",
      "subject": "Assunto",
      "message": "Mensagem",
      "send": "Enviar",
      "success": "Sucesso",
      "error": "Erro",
      "loading": "Carregando...",
      "product_created": "Produto criado com sucesso",
      "product_updated": "Produto actualizado com sucesso",
      "product_deleted": "Produto eliminado com sucesso",
      "movement_created": "Movimento criado com sucesso",
      "insufficient_stock": "Stock insuficiente"
    }
  },
  'pt-BR': {
    translation: {
      "app_name": "Controle de Venda",
      "login": "Entrar",
      "logout": "Sair",
      "login_with_google": "Entrar com Google",
      "welcome": "Bem-vindo",
      "dashboard": "Painel",
      "products": "Produtos",
      "scanner": "Scanner",
      "history": "Histórico",
      "reports": "Relatórios",
      "support": "Suporte",
      "settings": "Configurações",
      "product_name": "Nome do Produto",
      "barcode": "Código de Barras",
      "current_stock": "Estoque Atual",
      "purchase_price": "Preço de Compra",
      "sale_price": "Preço de Venda",
      "currency": "Moeda",
      "add_product": "Adicionar Produto",
      "edit_product": "Editar Produto",
      "delete_product": "Excluir Produto",
      "scan_barcode": "Escanear Código",
      "entry": "Entrada",
      "exit": "Saída",
      "quantity": "Quantidade",
      "note": "Nota",
      "date": "Data",
      "type": "Tipo",
      "save": "Salvar",
      "cancel": "Cancelar",
      "search": "Pesquisar"
    }
  },
  'pt-PT': {
    translation: {
      "app_name": "Controlo de Venda",
      "login": "Entrar",
      "logout": "Sair",
      "login_with_google": "Entrar com Google",
      "welcome": "Bem-vindo",
      "dashboard": "Painel",
      "products": "Produtos",
      "scanner": "Scanner",
      "history": "Histórico",
      "reports": "Relatórios",
      "support": "Suporte",
      "settings": "Definições",
      "product_name": "Nome do Produto",
      "barcode": "Código de Barras",
      "current_stock": "Stock Actual",
      "purchase_price": "Preço de Compra",
      "sale_price": "Preço de Venda"
    }
  },
  'es': {
    translation: {
      "app_name": "Control de Ventas",
      "login": "Iniciar Sesión",
      "logout": "Cerrar Sesión",
      "login_with_google": "Iniciar con Google",
      "welcome": "Bienvenido",
      "dashboard": "Panel",
      "products": "Productos",
      "scanner": "Escáner",
      "history": "Historial",
      "reports": "Informes",
      "support": "Soporte",
      "settings": "Configuración",
      "product_name": "Nombre del Producto",
      "barcode": "Código de Barras",
      "current_stock": "Stock Actual",
      "purchase_price": "Precio de Compra",
      "sale_price": "Precio de Venta"
    }
  },
  'fr': {
    translation: {
      "app_name": "Contrôle des Ventes",
      "login": "Connexion",
      "logout": "Déconnexion",
      "login_with_google": "Se connecter avec Google",
      "welcome": "Bienvenue",
      "dashboard": "Tableau de bord",
      "products": "Produits",
      "scanner": "Scanner",
      "history": "Historique",
      "reports": "Rapports",
      "support": "Support",
      "settings": "Paramètres",
      "product_name": "Nom du Produit",
      "barcode": "Code-barres",
      "current_stock": "Stock Actuel",
      "purchase_price": "Prix d'Achat",
      "sale_price": "Prix de Vente"
    }
  },
  'zu': {
    translation: {
      "app_name": "Ukulawula Ukuthengisa",
      "login": "Ngena",
      "logout": "Phuma",
      "login_with_google": "Ngena nge-Google",
      "welcome": "Siyakwamukela",
      "dashboard": "Ibhodi",
      "products": "Imikhiqizo",
      "scanner": "Isikena",
      "history": "Umlando",
      "reports": "Imibiko",
      "support": "Usekelo",
      "settings": "Izilungiselelo"
    }
  },
  'sn': {
    translation: {
      "app_name": "Kudzora Kutengesa",
      "login": "Pinda",
      "logout": "Buda",
      "login_with_google": "Pinda ne-Google",
      "welcome": "Mauya",
      "dashboard": "Bhodhi",
      "products": "Zvigadzirwa",
      "scanner": "Sikena",
      "history": "Nhoroondo",
      "reports": "Mishumo",
      "support": "Rubatsiro",
      "settings": "Mamiriro"
    }
  },
  'sw': {
    translation: {
      "app_name": "Udhibiti wa Mauzo",
      "login": "Ingia",
      "logout": "Toka",
      "login_with_google": "Ingia kwa Google",
      "welcome": "Karibu",
      "dashboard": "Dashibodi",
      "products": "Bidhaa",
      "scanner": "Skana",
      "history": "Historia",
      "reports": "Ripoti",
      "support": "Msaada",
      "settings": "Mipangilio"
    }
  },
  'en-ZA': {
    translation: {
      "app_name": "Sales Control",
      "login": "Login",
      "logout": "Logout",
      "login_with_google": "Login with Google",
      "welcome": "Welcome",
      "dashboard": "Dashboard",
      "products": "Products",
      "scanner": "Scanner",
      "history": "History",
      "reports": "Reports",
      "support": "Support",
      "settings": "Settings",
      "product_name": "Product Name",
      "barcode": "Barcode",
      "current_stock": "Current Stock",
      "purchase_price": "Purchase Price",
      "sale_price": "Sale Price"
    }
  },
  'en-US': {
    translation: {
      "app_name": "Sales Control",
      "login": "Login",
      "logout": "Logout",
      "login_with_google": "Login with Google",
      "welcome": "Welcome",
      "dashboard": "Dashboard",
      "products": "Products",
      "scanner": "Scanner",
      "history": "History",
      "reports": "Reports",
      "support": "Support",
      "settings": "Settings",
      "product_name": "Product Name",
      "barcode": "Barcode",
      "current_stock": "Current Stock",
      "purchase_price": "Purchase Price",
      "sale_price": "Sale Price"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt-MZ',
    fallbackLng: 'pt-MZ',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;