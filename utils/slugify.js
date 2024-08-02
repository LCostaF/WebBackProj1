function slugify(text) {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Substitui espaços por -
      .replace(/[^\w\-]+/g, '')       // Remove todos os caracteres não alfanuméricos
      .replace(/\-\-+/g, '-')         // Substitui múltiplos - por um único -
      .replace(/^-+/, '')             // Corta - do início da string
      .replace(/-+$/, '');            // Corta - do final da string
  }
  
module.exports = slugify;
  