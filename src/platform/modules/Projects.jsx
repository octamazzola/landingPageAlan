export default function Projects({ projects, lang, onDelete, onOpen }) {
  if (!projects.length) return <div className="empty-state"><span>◇</span><h3>{lang === 'pt' ? 'Ainda não há projetos' : lang === 'en' ? 'No projects yet' : 'Todavía no hay proyectos'}</h3><p>Guardá configuraciones desde el Constructor.</p></div>
  return <div className="project-grid">{projects.map((project) => {
    const previewText = project.snapshot?.promptText || '';
    const truncatedPreview = previewText.length > 85 ? previewText.substring(0, 85) + '...' : previewText;
    return <article className="card project-card" key={project.id}>
      <p className="eyebrow">{new Date(project.created_at).toLocaleDateString('es-AR')}</p>
      <h3>{project.name}</h3>
      <p>{project.snapshot?.outputMode || 'universal'} · {project.snapshot?.actionCode || 'sin acción'}</p>
      {truncatedPreview && (
        <p style={{ 
          fontSize: '11px', 
          color: '#555', 
          margin: '8px 0', 
          fontStyle: 'italic', 
          background: '#f9f9f9', 
          padding: '6px 10px', 
          borderRadius: '8px', 
          border: '1px solid #eee',
          fontFamily: 'IBM Plex Mono',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {truncatedPreview}
        </p>
      )}
      <div>
        <button className="button ghost small" onClick={() => onOpen(project)}>Ver configuración</button>
        <button className="button danger small" onClick={() => onDelete(project.id)}>Eliminar</button>
      </div>
    </article>
  })}</div>
}
