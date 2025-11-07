// ============================================================
// ✅ Carrinho global (fora do DOMContentLoaded)
// ============================================================
let carrinho = [];


// ============================================================
// ✅ CÓDIGO PARA A PÁGINA DE PRODUTOS
// ============================================================
document.addEventListener("DOMContentLoaded", () => {

    const listaCarrinho = document.getElementById("itens-carrinho");
    const botoesAdicionar = document.querySelectorAll(".adicionar-carrinho");

    if (listaCarrinho && botoesAdicionar.length > 0) {

        const totalSpan = document.getElementById("total");

        function atualizarCarrinho() {
            listaCarrinho.innerHTML = "";
            let total = 0;

            carrinho.forEach((item, index) => {
                total += item.preco * item.quantidade;

                const li = document.createElement("li");
                li.innerHTML = `
                    ${item.nome} x${item.quantidade} - R$ ${(item.preco * item.quantidade).toFixed(2)}
                    <button class="remover" data-index="${index}" style="margin-left:8px;">X</button>
                `;
                listaCarrinho.appendChild(li);
            });

            totalSpan.textContent = total.toFixed(2);

            document.querySelectorAll(".remover").forEach(btn => {
                btn.addEventListener("click", removerItem);
            });
        }

        function removerItem(event) {
            const index = event.target.getAttribute("data-index");
            carrinho.splice(index, 1);
            atualizarCarrinho();
        }

        botoesAdicionar.forEach((btn) => {
            btn.addEventListener("click", (event) => {
                const itemDiv = event.target.closest(".item-grid");

                const nome = itemDiv.querySelector("strong").innerText;
                const precoTexto = itemDiv.querySelector("p:nth-of-type(3)").innerText;
                const preco = parseFloat(precoTexto.replace("R$ ", "").replace(",", "."));
                const qtdInput = itemDiv.querySelector(".input-qtd");
                const quantidade = parseInt(qtdInput.value);

                if (quantidade <= 0) {
                    alert("Escolha uma quantidade maior que 0.");
                    return;
                }

                const existente = carrinho.find(item => item.nome === nome);

                if (existente) {
                    existente.quantidade += quantidade;
                } else {
                    carrinho.push({ nome, preco, quantidade });
                }

                qtdInput.value = 0;

                atualizarCarrinho();
            });
        });

        const botoesAumentar = document.querySelectorAll(".aumentar");
        const botoesDiminuir = document.querySelectorAll(".diminuir");

        botoesAumentar.forEach((btn) => {
            btn.addEventListener("click", (event) => {
                const input = event.target.parentElement.querySelector(".input-qtd");
                input.value = parseInt(input.value) + 1;
            });
        });

        botoesDiminuir.forEach((btn) => {
            btn.addEventListener("click", (event) => {
                const input = event.target.parentElement.querySelector(".input-qtd");
                if (input.value > 0) {
                    input.value = parseInt(input.value) - 1;
                }
            });
        });

    }

    // ============================================================
    // ✅ CÓDIGO PARA A PÁGINA carrinho.html
    // ============================================================

    const listaResumo = document.getElementById("lista-resumo");
    const subtotalSpan = document.getElementById("total-resumo");
    const descontoSpan = document.getElementById("desconto");
    const totalFinalSpan = document.getElementById("total-final");
    const totalEuroSpan = document.getElementById("total-euro");
    const pagamentoSelect = document.getElementById("pagamento");
    const tipoPagamentoSelect = document.getElementById("tipo-pagamento");
    const btnWhatsapp = document.getElementById("btn-whatsapp");

    if (!listaResumo) return;

    // Carregado carrinho salvo
    const carrinhoSalvo = JSON.parse(localStorage.getItem("carrinho")) || [];

    let subtotal = 0;

    carrinhoSalvo.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.nome} x${item.quantidade} - R$ ${(item.preco * item.quantidade).toFixed(2)}`;
        listaResumo.appendChild(li);

        subtotal += item.preco * item.quantidade;
    });

    subtotalSpan.textContent = subtotal.toFixed(2);

    // ✅ Desconto 10% acima de R$ 50
    let desconto = subtotal > 50 ? subtotal * 0.10 : 0;
    descontoSpan.textContent = desconto.toFixed(2);

    // ✅ Total final
    let totalFinal = subtotal - desconto;
    totalFinalSpan.textContent = totalFinal.toFixed(2);

    // ✅ Conversão Euro (1 EUR = 6 BRL)
    function atualizarEuro() {
        if (pagamentoSelect.value === "euro") {
            let totalEuro = totalFinal / 6;
            totalEuroSpan.textContent = totalEuro.toFixed(2);
        } else {
            totalEuroSpan.textContent = "0.00";
        }
    }

    pagamentoSelect.addEventListener("change", atualizarEuro);
    atualizarEuro();

    // ✅ Enviar WhatsApp
    btnWhatsapp.addEventListener("click", () => {

        const nome = document.getElementById("nome").value;

        if (nome.trim() === "") {
            alert("Digite seu nome antes de enviar.");
            return;
        }

        let mensagem = `Pedido de ${nome}:%0A%0A`;

        carrinhoSalvo.forEach(item => {
            mensagem += `• ${item.nome} x${item.quantidade} - R$ ${(item.preco * item.quantidade).toFixed(2)}%0A`;
        });

        mensagem += `%0ASubtotal: R$ ${subtotal.toFixed(2)}`;
        mensagem += `%0ADesconto: R$ ${desconto.toFixed(2)}`;
        mensagem += `%0ATotal Final: R$ ${totalFinal.toFixed(2)}`;

        if (pagamentoSelect.value === "euro") {
            mensagem += `%0ATotal em Euro: € ${totalEuroSpan.textContent}`;
        }

        mensagem += `%0ATipo de Pagamento: ${tipoPagamentoSelect.value.toUpperCase()}`;

        const numero = "5511972862917"; // coloque o número correto
        const url = `https://wa.me/${numero}?text=${mensagem}`;

        window.open(url, "_blank");
    });

});


// ============================================================
// ✅ BOTÃO FINALIZAR COMPRA (na página de produtos)
// ============================================================
function finalizarCompra() {

    localStorage.setItem("carrinho", JSON.stringify(carrinho));

    alert("Redirecionando para o resumo da compra!");

    window.location.href = "carrinho.html";
}
