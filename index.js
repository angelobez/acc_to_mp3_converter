const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

function convertAacToMp3(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .toFormat('mp3')
      .on('start', (commandLine) => {
        console.log('Iniciando conversão:', commandLine);
      })
      .on('progress', (progress) => {
        console.log(`Progresso (${path.basename(inputPath)}): ${progress.percent}% concluído.`);
      })
      .on('error', (err) => {
        console.error(`Erro durante a conversão de ${path.basename(inputPath)}:`, err.message);
        reject(err);
      })
      .on('end', () => {
        console.log(`Conversão concluída! Arquivo salvo em: ${outputPath}`);
        resolve();
      })
      .save(outputPath);
  });
}

async function convertAllAacToMp3(inputDir, outputDir) {
  try {
    const files = fs.readdirSync(inputDir).filter((file) => file.endsWith('.aac'));

    if (files.length === 0) {
      console.log('Nenhum arquivo AAC encontrado no diretório:', inputDir);
      return;
    }

    for (const file of files) {
      const inputPath = path.join(inputDir, file);
      const outputFileName = path.basename(file, '.aac') + '.mp3';
      const outputPath = path.join(outputDir, outputFileName);

      console.log(`Convertendo: ${file} -> ${outputFileName}`);
      await convertAacToMp3(inputPath, outputPath);
    }

    console.log('Todos os arquivos foram convertidos com sucesso!');
  } catch (err) {
    console.error('Erro ao processar os arquivos:', err.message);
  }
}

const inputDirectory = 'C:/dev/aac_to_mp3_converter/aac_input';
const outputDirectory = 'C:/dev/aac_to_mp3_converter/mp3_output';

convertAllAacToMp3(inputDirectory, outputDirectory);
