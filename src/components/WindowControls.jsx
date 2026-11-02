import useWindowStore from '#store/window'
import { useTranslation } from '#store/language'
import { Maximize2, Minimize2, Minus, X } from 'lucide-react'

const WindowControls = ({target}) => {
  const {closeWindow, minimizeWindow, toggleMaximize, windows} = useWindowStore();
  const t = useTranslation();
  const isMaximized = windows[target].isMaximized;
  const maximizeLabel = t(isMaximized ? 'Restore' : 'Maximize');
  const MaximizeIcon = isMaximized ? Minimize2 : Maximize2;

  // Los botones viven dentro de la zona de arrastre: se evita que un clic inicie un movimiento
  const stop = (e) => e.stopPropagation();

  return <div id='window-controls' onPointerDown={stop}>
    <button type='button' className='close' aria-label={t('Close')} title={t('Close')} onClick={()=>closeWindow(target)}>
      <X strokeWidth={3}/>
    </button>
    <button type='button' className='minimize' aria-label={t('Minimize')} title={t('Minimize')} onClick={()=>minimizeWindow(target)}>
      <Minus strokeWidth={3}/>
    </button>
    <button type='button' className='maximize' aria-label={maximizeLabel} title={maximizeLabel} onClick={()=>toggleMaximize(target)}>
      <MaximizeIcon strokeWidth={3}/>
    </button>
  </div>
}

export default WindowControls
