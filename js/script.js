const produtos = [
    {
        id: 1,
        nome: "Pão francês",
        cat: "Pães",
        desc: "Quentinho e crocante",
        preco: 1.20
    },
    {
        id: 2,
        nome: "Sonho com creme",
        cat: "Doces",
        desc: "Recheado na hora",
        preco: 5.20
    },
    {
        id: 3,
        nome: "Pão de açúcar",
        cat: "Pães",
        desc: "Macio e saboroso",
        preco: 4.50
    },
    {
        id: 4,
        nome: "Croissant",
        cat: "Salgados",
        desc: "Massa folhada e crocante",
        preco: 6.50
    },
    {
        id: 5,
        nome: "Bolo de chocolate",
        cat: "Bolos",
        desc: "Massa fofinha com cobertura",
        preco: 8.00
    },
    {
        id: 6,
        nome: "Torta de frango",
        cat: "Salgados",
        desc: "Recheada com frango desfiado",
        preco: 7.50
    },
    {
        id: 7,
        nome: "Pão de queijo",
        cat: "Salgados",
        desc: "Quentinho e feito com queijo",
        preco: 3.50
    },
    {
        id: 8,
        nome: "Bolo de cenoura",
        cat: "Bolos",
        desc: "Com deliciosa cobertura de chocolate",
        preco: 7.00
    },
    {
        id: 9,
        nome: "Coxinha de frango",
        cat: "Salgados",
        desc: "Massa macia com recheio cremoso",
        preco: 6.00
    },
    {
        id: 10,
        nome: "Pão de milho",
        cat: "Pães",
        desc: "Levemente adocicado e macio",
        preco: 4.00
    },
    {
        id: 11,
        nome: "Brigadeiro",
        cat: "Doces",
        desc: "Tradicional com chocolate granulado",
        preco: 2.50
    },
    {
        id: 12,
        nome: "Empada de frango",
        cat: "Salgados",
        desc: "Massa amanteigada e recheio de frango",
        preco: 5.50
    }
];

let carrinho = [];
const FRETE_GRATIS = 30;
let cateriaAtiva = "Todos";

//=======================================================
// FILTRO DE CATEGORIA
//=======================================================

function montarCategoria(){
    const cats = ["Todos", ...new Set(produtos.map(p => p.cat ))];
    const div = document.getElementById("categorias");
    div.innerHTML = "";
    cats.forEach(c => {
        div.innerHTML += `
            <button class="cat-btn" onclick="filtrar('${c}')">
                ${c}
            </button>
        `;
    });
}

function filtrar(cat){
    cateriaAtiva = cat;
     montarCategoria();
     montarProdutos()
}

//=======================================================
// MONTAR OS CARDS
//=======================================================

function montarProdutos(){
    const grade = document.getElementById("grade");
    
    const lista = (cateriaAtiva === "Todos")
    ? produtos
    : produtos.filter(p => p.cat === cateriaAtiva);
    
    document.getElementById("contador").textContent = lista.length + " produtos";
    grade.innerHTML = "";
    
    lista.forEach(p => {
        grade.innerHTML += `
        <div class="card">
            <img src="./imagens/1.png" alt="Exemplo"
            class="produto-img"/>
        
            <div class="produto-info">
                <p class="categoria">${p.cat}</p>
                <h3>${p.nome}</h3>
                <p class="descricao-produto">${p.desc}</p>
                <p class="preco">R$ ${formatarPreco(p.preco)}</p>
            </div>

            <button class="btn-produto" onclick="adicionarCarrinho(${p.id})">
                Adicionar à sacola
            </button>
        </div>
            `;
    });
    
}

//Formatar número para pt-br
function formatarPreco(preco){ return preco.toFixed(2).replace(".", ",");}

//=======================================================
// CARRINHO
//=======================================================

function adicionarCarrinho(id){
    const produto = produtos.find(p => p.id === id);
    const item = carrinho.find(i => i.produto.id === id);
    if(item){
        item.quantidade++;
    }else{
        carrinho.push({produto, quantidade: 1});
    }
    atualizarCarrinho();
    abrirCarrinho();
}

function calcularTotal(){
    return carrinho.reduce((s, i)=> s + i.produto.preco * i.quantidade, 0);
}

function mudarQtd(id, delta){
    const item = carrinho.find(i => i.produto.id === id);
    if(!item) return;
    item.quantidade += delta;
    if(item.quantidade <= 0) carrinho = carrinho.filter(i => i.produto.id !== id);
    atualizarCarrinho();
}

function remover(id){
    carrinho = carrinho.filter(i => i.produto.id !== id);
    atualizarCarrinho();
}

function atualizarCarrinho(){
    const lista = document.getElementById("carrinho-itens");
    const total = calcularTotal();
    const totalItens = carrinho.reduce((s, i) => s + i.quantidade, 0);
    document.getElementById("badge").textContent = totalItens;

    if(carrinho.length === 0){
        lista.innerHTML = `<div class="vazio">Sua sacola está vazia.</div>`;
        document.getElementById("btn-finalizar").disabled = true;
        document.getElementById("frete-aviso").textContent = "";
    }else{
         lista.innerHTML = "";
         carrinho.forEach(i => {
            const sub = i.produto.preco * i.quantidade;
            lista.innerHTML += `
                <div class="item">
                    <div class="item-info">
                        <h4>${i.produto.nome}</h4>
                        <div class="item-preco">R$ ${formatarPreco(sub)}</div>
                        <div class="qtd-controle">
                                <button onclick="mudarQtd(${i.produto.id}, -1)"> - </button>
                                <span>${i.quantidade}</span>
                                <button onclick="mudarQtd(${i.produto.id}, 1)"> + </button>
                        </div>
                    </div>

                    <button class="btn-remover" onclick="remover(${i.produto.id})"> x </button>
                </div>
            `;
         });

         document.getElementById("btn-finalizar").disabled = false;
         const aviso = document.getElementById("frete-aviso");
         if(total >= FRETE_GRATIS){
            aviso.textContent = " Você ganhou frete grátis!";
        }else{
             aviso.textContent =  `Faltam R$ ${formatarPreco(FRETE_GRATIS - total)} para o frete grátis.`;

         }
    }
    document.getElementById("total").textContent = "R$ " + formatarPreco(total);

}

//=======================================================
// ABRIR CARRINHO | FECHAR CARRINHO
//=======================================================
function abrirCarrinho(){
    document.getElementById("carrinho").classList.add("aberto");
    document.getElementById("overlay").classList.add("aberto");
    document.getElementById('navegacao').classList.remove("aberto");
}

function fecharCarrinho(){
    document.getElementById("carrinho").classList.remove("aberto");
    document.getElementById("overlay").classList.remove("aberto");
}



//=======================================================
// ABRIR MODAL
//=======================================================

function abrirModal(){
    let linhas = "";
    carrinho.forEach(i =>{
        const sub = i.produto.preco * i.quantidade;
        linhas += `
        <div class="linha"> 
           <span> ${i.quantidade}x ${i.produto.nome} </span>
           <span> ${formatarPreco(sub)} </span>
        </div>`;
    });

    document.getElementById("modal-conteudo").innerHTML = `
        <h2 class="titulo"> Finalizar Compra</h2>
        <p class="sub" class="paragrafo-produto"> Confira seu pedido e os dados de entrega </p>

        <div class="resumo">
                ${linhas}
            <div class="linha-total">
                <span> Total </span>
                <span> ${formatarPreco(calcularTotal())} </span>
            </div>
        </div>

        <form onsubmit="confirmarPedido(event)">
            <label for="nome">Nome Completo</label>
            <input id="nome" type="text" placeholder="Digite seu nome completo" required/>

            <label for="tel">Telefone (Whatsapp)</label>
            <input id="tel" type="tel" placeholder="(xx) xxxxx-xxxx" required/>

            <label for="endereco">Endereço de Entrega</label>
            <input id="endereco" type="text" placeholder="Rua, n°, bairro" required/>


            <label for="pagamento">Forma de Pagamento</label>
            <select id="pagamento" required>
                <option value="">Selecione</option>
                <option value="pix">PIX</option>
                <option value="cartao">Cartão na entrega</option>
                <option value="dinheiro">Dinheiro</option>
            </select>
            <div class="modal-botoes">
                <button onclick="fecharModal()" class="btn-voltar">Voltar</button>
                <button type="submit"
                class="btn-confirmar">Confirmar pedido</button>
            </div>
        </form>`;

        document.getElementById("modal-overlay").classList.add("aberto");
        fecharCarrinho();
}

function fecharModal(){
    document.getElementById("modal-overlay").classList.remove("aberto");
}

/* Whatsapp */

const numeroWhats = "5585992641415";

function confirmarPedido(event){
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const tel = document.getElementById("tel").value;
    const endereco = document.getElementById("endereco").value;
    const pagamento = document.getElementById("pagamento").value;
    const numero = Math.floor(Math.random() * 9000 + 1000);


    let msg = "Olá! Quero Fazer um pedido";
    msg += `*Pedido #${numero}`;

    carrinho.forEach(i =>{
          const sub = i.produto.preco * i.quantidade;
          msg += `
            - ${i.quantidade} x ${i.produto.nome} - R$ ${formatarPreco(sub)}

          `;
    });

    msg += `
        Total: R$ ${formatarPreco(calcularTotal())}
        ${nome},
        ${tel},
        ${endereco},
        ${pagamento},
    `;

    const link = "https://wa.me/" + numeroWhats + "?text=" + encodeURIComponent(msg);
    
    document.getElementById("modal-conteudo").innerHTML = `
        <div class="sucesso">
            <div> ✅ </div>
            <h2 class="titulo"> Pedido pronto! </h2>
            <p class="paragrafo-produto">
                Obrigada, <b> ${nome} </b>. <br/>
                Seu pedido <b> #${numero} </b> está montado. <br/>
                Clique abaixo para enviá-lo pelo Whatsapp e finaliza. 
            </p>

            <div class="modal-botoes">
                <a href="${link}" target="_blank" 
                    class="btn-confirmar" onclick="carrinho=[]; atualizarCarrinho();">
                    Enviar pedido pelo Whatsapp
                </a>
                <button onclick="novoPedido()" class="btn-voltar">
                    Voltar à loja
                </button>
            </div>
        </div>
    `;
}

function novoPedido(){
    fecharModal();
    fecharCarrinho();
}

const navegacao = document.getElementById('navegacao');

function toggleMenu(){
   navegacao.classList.toggle("aberto");
   console.log("Cliquei");
}

if(navegacao){
    const links = navegacao.querySelectorAll("a");

    links.forEach(link =>{
        link.addEventListener('click', function(){
            navegacao.classList.remove("aberto");
        });
    });
}



//=======================================================
// INICIAR
//=======================================================

window.addEventListener('load', ()=>{
    montarCategoria();
    montarProdutos();
    atualizarCarrinho();
});


