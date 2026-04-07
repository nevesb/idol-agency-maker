import type { DayResult, GameMessage, GameStateV1 } from '$lib/types/simulation';

/** Generate messages from day simulation results (wellness alerts, job outcomes, contract warnings). */
export function generateDayMessages(
	state: GameStateV1,
	dayIndex: number,
	dayResult: DayResult
): GameMessage[] {
	const messages: GameMessage[] = [];
	const week = state.absoluteWeek;

	for (const update of dayResult.idolUpdates) {
		const idol = state.idols.find((i) => i.id === update.idolId);
		if (!idol) continue;

		if (update.wellness.physical < 20) {
			messages.push({
				id: `msg_${week}_${dayIndex}_health_${idol.id}`,
				week,
				day: dayIndex,
				from: 'staff_medical',
				subject: `${idol.nameRomaji}: Alerta de Saúde`,
				body: `${idol.nameRomaji} precisa de descanso imediato. Saúde física em nível crítico.`,
				category: 'urgent',
				read: false,
				relatedIdolId: idol.id,
				actionUrl: `/roster/${idol.id}`
			});
		}

		if (update.wellness.stress > 85) {
			messages.push({
				id: `msg_${week}_${dayIndex}_stress_${idol.id}`,
				week,
				day: dayIndex,
				from: idol.nameRomaji,
				subject: 'Preciso de uma pausa...',
				body: 'Estou muito cansada, não sei se consigo continuar assim esta semana.',
				category: 'urgent',
				read: false,
				relatedIdolId: idol.id,
				actionUrl: `/roster/${idol.id}`
			});
		}

		if (update.wellness.happiness < 25) {
			messages.push({
				id: `msg_${week}_${dayIndex}_happy_${idol.id}`,
				week,
				day: dayIndex,
				from: idol.nameRomaji,
				subject: 'Pensando sobre meu futuro...',
				body: 'Não estou feliz com a situação atual. Gostaria de conversar.',
				category: 'info',
				read: false,
				relatedIdolId: idol.id,
				actionUrl: `/roster/${idol.id}`
			});
		}
	}

	for (const jr of dayResult.jobResults) {
		if (jr.outcome === 'success' && jr.performance >= 0.85) {
			const idol = state.idols.find((i) => i.id === jr.idolId);
			messages.push({
				id: `msg_${week}_${dayIndex}_jobsuccess_${jr.jobId}`,
				week,
				day: dayIndex,
				from: 'staff_pr',
				subject: `${idol?.nameRomaji ?? 'Idol'}: Performance Excelente!`,
				body: 'Grande resultado no job de hoje. A mídia está elogiando.',
				category: 'info',
				read: false,
				relatedIdolId: jr.idolId,
				relatedJobId: jr.jobId
			});
		}

		if (jr.outcome === 'failure') {
			const idol = state.idols.find((i) => i.id === jr.idolId);
			messages.push({
				id: `msg_${week}_${dayIndex}_jobfail_${jr.jobId}`,
				week,
				day: dayIndex,
				from: 'staff_pr',
				subject: `${idol?.nameRomaji ?? 'Idol'}: Resultado Abaixo`,
				body: 'O job não foi bem. Talvez precisemos repensar a agenda.',
				category: 'task',
				read: false,
				relatedIdolId: jr.idolId,
				relatedJobId: jr.jobId
			});
		}
	}

	if (dayIndex === 0) {
		for (const contract of state.contracts) {
			if (contract.status !== 'active') continue;
			const weeksLeft = contract.expiresWeek - week;
			if (weeksLeft > 0 && weeksLeft <= 4) {
				const idol = state.idols.find((i) => i.contractId === contract.id);
				if (idol) {
					messages.push({
						id: `msg_${week}_contract_${contract.id}`,
						week,
						day: 0,
						from: 'staff_admin',
						subject: `Contrato de ${idol.nameRomaji} expira em ${weeksLeft} semana(s)`,
						body: 'O contrato precisa ser renovado ou a idol deixará a agência.',
						category: 'task',
						read: false,
						relatedIdolId: idol.id,
						actionUrl: `/roster/${idol.id}`
					});
				}
			}
		}
	}

	return messages;
}

/** Generate weekly system messages (financial summaries, low-funds warnings). */
export function generateWeeklyMessages(state: GameStateV1): GameMessage[] {
	const messages: GameMessage[] = [];
	const week = state.absoluteWeek;

	if (week % 4 === 0) {
		messages.push({
			id: `msg_${week}_monthly`,
			week,
			day: 0,
			from: 'staff_accountant',
			subject: 'Relatório Mensal',
			body: `Saldo atual: ¥${state.balanceYen.toLocaleString()}. Tier: ${state.agencyTier}.`,
			category: 'info',
			read: false,
			actionUrl: '/financas'
		});
	}

	if (state.balanceYen < 500_000) {
		messages.push({
			id: `msg_${week}_lowfunds`,
			week,
			day: 0,
			from: 'staff_accountant',
			subject: 'Alerta: Saldo Baixo',
			body: 'O saldo da agência está baixo. Considere aceitar mais jobs ou reduzir custos.',
			category: 'urgent',
			read: false,
			actionUrl: '/financas'
		});
	}

	return messages;
}
