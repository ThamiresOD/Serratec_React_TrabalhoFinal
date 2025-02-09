import { useState, useEffect } from 'react'
import { Button, Container, Form, Stack } from 'react-bootstrap';
import api from '../../../service/api'
import CardProduto from '../../Cards'
import Header from '../../Header/header';
import './style.css'





function App() {
  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [preco, setPreco] = useState("")
  const [produtoList, setProdutoList] = useState([])
  const [isEditing, setEditing] = useState({ id: "", edit: false });
  const [imagUrl, setImagUrl] = useState("")


  const getProdutos = async () => {
    const { data } = await api.get("/produtos");
    setProdutoList(data);
  }

  useEffect(() => {
    getProdutos()
  }, []);



  const reset = () => {
    setImagUrl("")
    setTitulo("")
    setDescricao("")
    setPreco("")
    setEditing({ id: "", edit: false })
  }



  const updateProdutoList = async () => {
    const newProduto = {
      imagUrl: imagUrl,
      titulo: titulo,
      descricao: descricao,
      preco: preco,
    };

    const { data, status } = await api.put(`/produtos/${isEditing.id}`, newProduto);
    console.log(data, status);
    if (status == 200) {
      const updatedProdutoList = produtoList.map(produto => {
        if (produto.id == data.id) {
          return data
        }
        return produto
      })
      setProdutoList(updatedProdutoList)
    }
    setImagUrl("");
    setTitulo("");
    setDescricao("");
    setPreco("");
    setEditing({ id: "", edit: false })
  }
  useEffect(() => {
    getProdutos();
  }, []);


  const deleteProduto = async (id) => {
    try {
      const { data, status } = await api.delete(`/produtos/${id}`);
      console.log(data, status);
      if (status == 200) {
        const updatedProdutoList = produtoList.filter((item) => item.id != data.id);
        setProdutoList(updatedProdutoList);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleProduto = async () => {
    if (titulo == "" || preco == "" || descricao == "") {
      alert("Preencha todos os campos")
      return
    }
    const newProduto = {
      imagUrl: imagUrl,
      titulo: titulo,
      descricao: descricao,
      preco: preco,

    }

    const { data } = await api.post("/produtos", newProduto)
    setProdutoList([...produtoList, data])
    console.log(data)

    setImagUrl("")
    setTitulo("")
    setDescricao("")
    setPreco("")


  }

  return (

    <>
      <Header />
      <Container className="bg-dark">
        <h1 className="text-center text-primary" >Lista de Produtos</h1>
        <Form>
          <Form.Group className="form" >
            <Form.Label className="text-primary">Título:</Form.Label>
            <Form.Control type="text text-primary" placeholder="Insira o título" onChange={e => setTitulo(e.target.value)} value={titulo} />
          </Form.Group>
          <Form.Group className="mb-3 text-primary" >
            <Form.Label>Preço:</Form.Label>
            <Form.Control type="text" placeholder="Insira o preço" onChange={e => setPreco(e.target.value)} value={preco} />
          </Form.Group>
          <Form.Group className="mb-3 text-primary" >
            <Form.Label>Imagem:</Form.Label>
            <Form.Control type="text" placeholder="Insira a url da imagem" onChange={e => setImagUrl(e.target.value)} value={imagUrl} />
          </Form.Group>
          <Form.Group className="mb-3 text-primary">
            <Form.Label>Descrição: </Form.Label>
            <Form.Control as="textarea" rows={3} onChange={e => setDescricao(e.target.value)} value={descricao} />
          </Form.Group>
          <Stack className="mb-3">
            {isEditing.edit ? (
              <>
                <Button className="" onClick={updateProdutoList}>
                  Salvar Produto
                </Button>
                <Button className="mt-2" onClick={reset}>
                  Cancelar
                </Button>
              </>
            ) :
              (<Button className="" onClick={handleProduto}>
                Cadastrar Novo Produto
              </Button>)
            }

          </Stack>
        </Form>
        <Stack>
          {produtoList.length > 0 && produtoList.map(item => {
            return <CardProduto key={item.id} produto={item} deleteProduto={deleteProduto}
              setImagUrl={setImagUrl}
              setTitulo={setTitulo}
              setDescricao={setDescricao}
              setPreco={setPreco}
              setEditing={setEditing} />

          })}
        </Stack>
      </Container>
    </>
  )
}

export default App
