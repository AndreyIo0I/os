import {Automaton} from '../types/types'
import {reverse} from './reverse'
import {determine} from './determine'

function brzozowskiMinimization(automaton: Automaton): Automaton {
	return determine(reverse(determine(reverse(automaton))))
}

export {
	brzozowskiMinimization,
}