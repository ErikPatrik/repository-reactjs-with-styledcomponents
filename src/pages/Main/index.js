import React, {useState, useCallback, useEffect} from 'react';
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from 'react-icons/fa';
import {Container, Form, SubmitButton, List, DeleteButton } from './styles';

import api from '../../services/api';
import { Link } from 'react-router-dom';

export default function Main(){
    const [newRepo, setNewRepo] = useState('')
    const [repositorios, setRepositorios] = useState([])
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState(null)

    // DidMount -- Buscar
    useEffect(() => {
        const repoStorage = localStorage.getItem('repos');

        if(repoStorage){
            setRepositorios(JSON.parse(repoStorage));
        }
    }, []);

    // // DidUpdate -- Salvar alterações
    // useEffect(() => {
    //     localStorage.setItem('repos', JSON.stringify(repositorios))
    // }, [repositorios])

    const handleInputChange = (e) => {
        setNewRepo(e.target.value)
        setAlert(null)
    }

    const handleSubmit = useCallback((e) => {
        e.preventDefault()

        async function submit() {
            setLoading(true)
            setAlert(null)

            try {

                // Verifica se algo foi digitado
                if (newRepo === '') {
                    throw new Error('Digite algum repositório')
                }

                const response = await api.get(`repos/${newRepo}`)

                const hasRepo = repositorios.find(repo => repo.name === newRepo)

                // Verifica se já tem o repostório carregado
                if (hasRepo) {
                    throw new Error('Repositório duplicado')
                }


                const data = {
                    name: response.data.full_name
                }

                setRepositorios([...repositorios, data])
                setNewRepo('')
            } catch (error) {
                setAlert((true))
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

        submit()

    }, [newRepo, repositorios   ])

    const handleDelete = useCallback((repo) => {
        const findRepo = repositorios.filter(r => r.name !== repo) // manda todos os repositórios diferente do que mandei, pra criar um novo array
        setRepositorios(findRepo)
    }, [repositorios])

    return(
        <Container>
            <h1>
                <FaGithub size={25}/>
                Meus Repositorios
            </h1>

            <Form onSubmit={handleSubmit} error={alert}>
                <input type="text"
                    placeholder="Adicionar Repositorios"
                    value={newRepo}
                    onChange={handleInputChange}/>

                <SubmitButton loading={loading ? 1 : 0}>
                    { loading ? (
                        <FaSpinner color='#FFF' size={14} />
                    ) : (
                        <FaPlus color='#FFF' size={14} />
                    )}
                </SubmitButton>
            </Form>

            <List>
                {repositorios.map(repo => (
                    <li key={repo.name}>
                        <span>
                            <DeleteButton onClick={() => handleDelete(repo.name)}>
                                <FaTrash size={14} />
                            </DeleteButton>
                            {repo.name}
                        </span>
                        <Link to={`/repository/${encodeURIComponent(repo.name)}`}>
                            <FaBars size={20}/>
                        </Link>
                    </li>
                ))}
            </List>
        </Container>
    )
}