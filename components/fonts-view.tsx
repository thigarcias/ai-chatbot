import React, { useState } from 'react'

interface Source {
    name: string
    title: string
    description: string
    icon: string
}

interface SourcesViewProps {
    sources: Source[]
}

export const SourcesView: React.FC<SourcesViewProps> = ({ sources }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [selectedSource, setSelectedSource] = useState<Source | null>(null)
    console.log(sources)

    const openModal = (source: Source) => {
        setSelectedSource(source)
        setModalIsOpen(true)
    }

    const closeModal = () => {
        setModalIsOpen(false)
        setSelectedSource(null)
    }

    return (
        <div>
            <div onClick={() => openModal(sources[0])} style={{ cursor: 'pointer', padding: '20px', border: '1px solid #ccc' }}>
                Fontes: {sources.map(source => source.icon).join(' ')}
            </div>
            {modalIsOpen && selectedSource && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times</span>
                        <h2>{selectedSource.name}</h2>
                        <h3>{selectedSource.title}</h3>
                        <div className={selectedSource.icon}></div>
                        <p>{selectedSource.description}</p>
                    </div>
                </div>
            )}
        </div>
    )
}
