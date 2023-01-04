let btnAdd = document.querySelector('#btnAdd')
let btnImportar = document.querySelector('#btnImportar')
let btnDownload = document.querySelector('#btnDownload')
let btnFazerDownload = document.querySelector('#btnFazerDownload')
let indiceItemEdicao = null

let jogos = [
    // {
    //     img: 'https://image.api.playstation.com/cdn/UP1004/CUSA00419_00/bTNSe7ok8eFVGeQByA5qSzBQoKAAY32R.png',
    //     nome: 'GTA 5',
    //     preco: '250.00'
    // },
    // {
    //     img: 'https://image.api.playstation.com/vulcan/img/rnd/202010/2618/w48z6bzefZPrRcJHc7L8SO66.png',
    //     nome: 'The Last Of US Part II',
    //     preco: '250.00'
    // }
]

renderizarJogos();

function renderizarJogos() {
    document.querySelector('ul').innerHTML = '';
    jogos.forEach((jogo, indice) => {
        let li = document.createElement('li')
        li.setAttribute('data-indice', indice)
        li.addEventListener('dblclick', function () {
            indiceItemEdicao = indice
            const { img, nome, preco } = jogos[indice]
            if (img != 'https://via.placeholder.com/120?text=IMG') {
                document.querySelector('#img').value = img
            }
            document.querySelector('#nome').value = nome
            document.querySelector('#preco').value = preco
            modal.adicionar()
        })

        let precoFormatado = parseFloat(jogo.preco)
            .toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                style: 'currency',
                currency: 'BRL'
            })

        li.innerHTML = `
            <div>
                <img src="${jogo.img}">
            </div>
            <div class="game-info">
                <h2>${jogo.nome}</h2>
                <h3>${precoFormatado}</h3>
            </div>
            <span class="icon-remove" data-indice="${indice}">
                <span class="material-symbols-outlined">
                    delete
                </span>
            </span>
        `

        document.querySelector('ul').appendChild(li)
    })

    if (jogos.length < 1) {
        document.querySelector('ul').innerHTML = `
            <li style="padding:2rem">
                <h2 style="text-align:center">
                    Nenhum jogo cadastrado :(
                </h2>
            </li>
        `
    }

    document.querySelectorAll('.icon-remove').forEach(x => {
        x.removeEventListener('click', deletar)
        x.addEventListener('click', deletar)
    })
}

function deletar(e) {
    if (window.confirm('Deseja excluir?')) {
        const indice = e.target.parentElement.getAttribute('data-indice')
        if (indice) {
            jogos.splice(indice, 1)
            renderizarJogos()
        }
    }
}

document.querySelector('#btnSalvar').addEventListener('click', function (e) {
    e.preventDefault()

    const img = document.querySelector('#img')
    const nome = document.querySelector('#nome')
    const preco = document.querySelector('#preco')

    if (!nome.value) {
        alert('Por favor informe o nome')
        return
    }

    if (!preco.value) {
        alert('Por favor informe o preço')
        return
    }

    const jogo = {
        img: img.value || 'https://via.placeholder.com/120?text=IMG',
        nome: nome.value,
        preco: preco.value
    }

    if (indiceItemEdicao != null) {
        jogos[indiceItemEdicao] = jogo
    } else {
        jogos.push(jogo)
    }

    modal.adicionar()
    renderizarJogos()
    indiceItemEdicao = null

    img.value = ''
    nome.value = ''
    preco.value = ''
})

btnAdd.addEventListener('click', () => {
    modal.adicionar()
})

btnImportar.addEventListener('click', () => {
    modal.importar()
})

btnDownload.addEventListener('click', () => {
    modal.download()
})

document.querySelectorAll('.btn-fechar-modal').forEach((x) => {
    x.addEventListener('click', function () {
        this.parentElement.classList.toggle('abrir')
        document.querySelector('.background-modal')
            .classList.toggle('abrir')
    })
})

btnFazerDownload.addEventListener('click', (e) => {
    e.preventDefault()
    const nomeArquivo = document.querySelector('#nomeArquivo').value
    if (!nomeArquivo) {
        alert('Por favor informe o nome')
        return
    }
    download()(jogos, `${nomeArquivo}.json`)
    modal.download()
})

const download = function () {
    const a = document.createElement('a')
    a.style = "display:none"
    document.body.appendChild(a)
    return function (dados, nomeArquivo) {
        const json = JSON.stringify(dados)
        const blob = new Blob([json], { type: 'octet/stream' })
        const url = window.URL.createObjectURL(blob)
        a.href = url
        a.download = nomeArquivo
        a.click()
        window.URL.revokeObjectURL(url)
    }
}

const modal = {
    download: function () {
        document.querySelector('[data-modal="download-jogos"]')
            .classList.toggle('abrir')
        document.querySelector('.background-modal')
            .classList.toggle('abrir')
    },
    importar: function () {
        document.querySelector('[data-modal="upload-jogos"]')
            .classList.toggle('abrir')
        document.querySelector('.background-modal')
            .classList.toggle('abrir')
    },
    adicionar: function () {
        document.querySelector('[data-modal="adicionar-jogo"]')
            .classList.toggle('abrir')
        document.querySelector('.background-modal')
            .classList.toggle('abrir')
    }
}

document.querySelector('#arquivo')
    .addEventListener('change', (e) => {
        const [arquivo] = e.target.files
        const leitor = new FileReader()

        leitor.addEventListener('load', () => {
            jogos = JSON.parse(leitor.result)
            renderizarJogos()
            modal.importar()
        })

        if (arquivo) {
            leitor.readAsText(arquivo)
        }
    })