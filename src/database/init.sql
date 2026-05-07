CREATE DATABASE IF NOT EXISTS contacts_api;

SET @contacts_table_exists = (
  SELECT COUNT(*)
  FROM information_schema.tables
  WHERE table_schema = 'contacts_api'
    AND table_name = 'contacts'
);

USE contacts_api;

CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

SELECT
  IF(
    @contacts_table_exists = 0,
    'Tabela contacts criada com sucesso.',
    'Tabela contacts já existia. Nenhuma alteração foi feita.'
  ) AS status;