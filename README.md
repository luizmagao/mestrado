# Quiz — Florestan Fernandes

Aplicação de quiz em **HTML, CSS e JavaScript puro**, que funciona **100% no navegador**, sem backend.

## Funcionalidades

- **5 perguntas** baseadas nos capítulos 5, 6 e 7 de *A Revolução Burguesa no Brasil*, de Florestan Fernandes.
- **Uma única tentativa**: o aluno só pode responder uma vez no mesmo navegador.
- **Pontuação persistida**: ao atualizar a página, o resultado continua visível e o quiz não pode ser refeito.
- **Explicações das respostas** na tela de resultado.
- **Design responsivo** para celulares e computadores.

## Como usar

1. Abra o arquivo `index.html` diretamente no navegador.
2. Não é necessário instalar nada nem configurar servidor.
3. Para publicar, basta enviar os três arquivos para qualquer hospedagem estática (GitHub Pages, Netlify, Vercel etc.).

## Arquivos

| Arquivo       | Função                                           |
|---------------|--------------------------------------------------|
| `index.html`  | Estrutura da página e perguntas                  |
| `style.css`   | Estilos visuais, responsividade e animações      |
| `app.js`      | Lógica do quiz, pontuação e `localStorage`       |

## Perguntas do quiz

1. **Crise do poder oligárquico**: a transição Império–República foi um colapso ou uma recomposição das estruturas de poder?
2. **A burguesia brasileira e o Estado**: por que a burguesia nacional convergiu para o Estado em vez de forjar instituições próprias?
3. **Capitalismo dependente**: a dependência foi apenas imposta de fora ou também construída pelas elites dominantes?
4. **Modelo autocrático-burguês**: na periferia capitalista, a transformação capitalista se associa à democracia ou à autocracia?
5. **Espírito modernizador moderado**: como a burguesia brasileira lidou com a modernização?

## Fluxo

1. O aluno informa o e-mail e clica em **Começar quiz**.
2. Responde as 5 perguntas, uma por vez.
3. Clica em **Enviar respostas**.
4. Vê a pontuação, a mensagem de resultado e as explicações.
5. Se atualizar a página, verá a tela de bloqueio com a pontuação conquistada. Não há botão para refazer.

## Como funciona o bloqueio

O navegador guarda, no `localStorage`, uma chave chamada `florestan_quiz_result`. Ela armazena:

- `completed: true` — indica que o quiz já foi respondido.
- `email` — e-mail do participante.
- `score` — pontuação obtida.
- `answers` — respostas escolhidas.
- `submittedAt` — data/hora do envio.

Ao carregar a página, o script verifica essa chave. Se o quiz já foi completado, a tela de bloqueio é exibida com a pontuação e as explicações.

### Limitações

- O bloqueio vale **apenas para o navegador/dispositivo em que o quiz foi respondido**. Se o aluno usar outro navegador, modo anônimo ou limpar os dados, conseguirá responder novamente.
- Para um controle real por pessoa, seria necessário um backend validando o e-mail.

## Como resetar o quiz (para testes)

No navegador, abra o Console (F12 → Console) e execute:

```js
localStorage.removeItem('florestan_quiz_result')
```

Depois, recarregue a página.

## Personalização

- Para alterar as perguntas, as alternativas ou as explicações, edite o objeto `QUESTIONS` no arquivo `app.js`.
- Para mudar o gabarito, edite a propriedade `correct` de cada pergunta.
- Para ajustar cores, tipografia e animações, edite o arquivo `style.css`.

## UX/UI implementada

- Uma pergunta por vez, com navegação “Voltar / Próxima”.
- Barra de progresso indicando o andamento.
- Validação amigável de e-mail e de respostas obrigatórias.
- Feedback visual na tela de resultado (acertos, erros e explicações).
- Tela de bloqueio quando o quiz já foi respondido.
- Layout responsivo para celulares.
